import crypto from "crypto";
import { SHOPIFY_API_SECRET } from "../config/shopify.js";
import WebhookLog from "../models/WebhookLog.js";
import Store from "../models/Store.js";
import Product, { buildProductOwnerFilter } from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";
import InventoryHistory from "../models/InventoryHistory.js";
import asyncHandler from "../utils/asyncHandler.js";

function getIo(req) {
  return req.app.get("io");
}

function verifyWebhook(req) {
  const hmac = req.headers["x-shopify-hmac-sha256"];
  const topic = req.headers["x-shopify-topic"];
  const shopDomain = req.headers["x-shopify-shop-domain"];
  const webhookId = req.headers["x-shopify-webhook-id"];

  if (!hmac || !shopDomain || !webhookId || !req.rawBody) {
    const error = new Error("Missing required webhook headers or raw body");
    error.statusCode = 400;
    throw error;
  }

  const generatedHash = crypto
    .createHmac("sha256", SHOPIFY_API_SECRET)
    .update(req.rawBody, "utf8")
    .digest("base64");

  if (generatedHash !== hmac) {
    const error = new Error("Invalid Shopify Webhook HMAC signature");
    error.statusCode = 401;
    throw error;
  }

  return { topic, shopDomain, webhookId };
}

async function checkIdempotency(webhookId, shopDomain, topic) {
  try {
    const existingLog = await WebhookLog.findOne({ webhookId });
    if (existingLog) {
      console.log(`Webhook ${webhookId} already processed.`);
      return true;
    }
    
    await WebhookLog.create({ webhookId, shopDomain, topic });
    return false;
  } catch (error) {
    if (error.code === 11000) return true; // Concurrency duplicate key
    throw error;
  }
}

// 1. orders/create
export const handleOrdersCreate = asyncHandler(async (req, res) => {
  const { topic, shopDomain, webhookId } = verifyWebhook(req);
  if (await checkIdempotency(webhookId, shopDomain, topic)) {
    return res.status(200).send("Already processed");
  }

  const order = req.body;
  const io = getIo(req);
  let updated = false;

  for (const item of order.line_items || []) {
    const queryOpts = [];
    if (item.product_id) queryOpts.push({ shopifyProductId: item.product_id.toString() });
    if (item.variant_id) queryOpts.push({ shopifyVariantId: item.variant_id.toString() });
    if (item.sku) queryOpts.push({ sku: item.sku });

    if (queryOpts.length === 0 || !item.quantity) continue;

    const result = await Product.findOneAndUpdate(
      {
        $or: queryOpts,
        ...buildProductOwnerFilter(shopDomain)
      },
      { 
        $inc: { stock: -item.quantity } 
      },
      { new: true }
    );
    if (result) updated = true;
  }

  if (updated && io) {
    io.to("inventory_updates").emit("inventoryUpdated", { source: "orders/create" });
  }

  res.status(200).send("OK");
});

// 2. inventory_levels/update
export const handleInventoryUpdate = asyncHandler(async (req, res) => {
  const { topic, shopDomain, webhookId } = verifyWebhook(req);
  if (await checkIdempotency(webhookId, shopDomain, topic)) {
    return res.status(200).send("Already processed");
  }

  const payload = req.body;
  const io = getIo(req);

  // Payload structure depending on API version might be an inventory_level object
  const inventoryItemId = payload.inventory_item_id?.toString();
  const available = payload.available; // absolute available quantity

  if (inventoryItemId && available !== undefined) {
    const result = await Product.findOneAndUpdate(
      {
        inventoryItemId,
        ...buildProductOwnerFilter(shopDomain)
      },
      { 
        stock: available 
      },
      { new: true }
    );

    if (result && io) {
      io.to("inventory_updates").emit("inventoryUpdated", { source: "inventory_levels/update" });
    }
  }

  res.status(200).send("OK");
});

// 3. products/update
export const handleProductsUpdate = asyncHandler(async (req, res) => {
  const { topic, shopDomain, webhookId } = verifyWebhook(req);
  if (await checkIdempotency(webhookId, shopDomain, topic)) {
    return res.status(200).send("Already processed");
  }

  const productMeta = req.body;
  const io = getIo(req);
  let updated = false;

  const shopifyProductId = productMeta.id?.toString();
  if (shopifyProductId) {
    // Determine total stock from all variants
    let totalStock = 0;
    
    // Also try to find inventory_item_id
    let primaryVariantId = null;
    let primaryInventoryItemId = null;

    if (Array.isArray(productMeta.variants)) {
      totalStock = productMeta.variants.reduce((acc, v) => acc + (v.inventory_quantity || 0), 0);
      if (productMeta.variants.length > 0) {
        primaryVariantId = productMeta.variants[0].id?.toString();
        primaryInventoryItemId = productMeta.variants[0].inventory_item_id?.toString();
      }
    }

    const updateFields = { title: productMeta.title };
    if (primaryVariantId) updateFields.shopifyVariantId = primaryVariantId;
    if (primaryInventoryItemId) updateFields.inventoryItemId = primaryInventoryItemId;

    // Optional: we can set stock if the product sync is comprehensive
    updateFields.stock = totalStock;

    const result = await Product.findOneAndUpdate(
      {
        shopifyProductId,
        ...buildProductOwnerFilter(shopDomain)
      },
      { $set: updateFields },
      { new: true }
    );
    
    if (result) updated = true;
  }

  if (updated && io) {
    io.to("inventory_updates").emit("inventoryUpdated", { source: "products/update" });
  }

  res.status(200).send("OK");
});

// 4. app/uninstalled
export const handleAppUninstalled = asyncHandler(async (req, res) => {
  const shopDomain = req.headers["x-shopify-shop-domain"];

  if (!shopDomain) {
    return res.status(400).json({ error: "Shop is required" });
  }

  try {
    await Product.deleteMany({ shop: shopDomain });
    await InventoryLog.deleteMany({ shop: shopDomain });
    await InventoryHistory.deleteMany({ shop: shopDomain });
    await Store.deleteOne({ shopName: shopDomain });

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(200);
  }
});

// 5. Mandatory GDPR Webhooks
export const handleCustomersDataRequest = asyncHandler(async (req, res) => {
  const { topic, shopDomain } = verifyWebhook(req);
  console.log(`✅ GDPR Webhook Received: ${topic} for ${shopDomain}`);
  console.log('Payload:', req.body);
  res.status(200).send("OK");
});

export const handleCustomersRedact = asyncHandler(async (req, res) => {
  const { topic, shopDomain } = verifyWebhook(req);
  console.log(`✅ GDPR Webhook Received: ${topic} for ${shopDomain}`);
  console.log('Payload:', req.body);
  res.status(200).send("OK");
});

export const handleShopRedact = asyncHandler(async (req, res) => {
  const { topic, shopDomain } = verifyWebhook(req);
  console.log(`✅ GDPR Webhook Received: ${topic} for ${shopDomain}`);
  console.log('Payload:', req.body);
  res.status(200).send("OK");
});
