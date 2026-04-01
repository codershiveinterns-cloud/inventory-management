import WebhookLog from "../models/WebhookLog.js";
import Store from "../models/Store.js";
import Product, { buildProductOwnerFilter } from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";
import InventoryHistory from "../models/InventoryHistory.js";
import asyncHandler from "../utils/asyncHandler.js";

function getIo(req) {
  return req.app.get("io");
}

function getWebhookContext(req) {
  return {
    topic: req.shopifyWebhook?.topic || req.get("x-shopify-topic") || "",
    shopDomain:
      req.shopifyWebhook?.shopDomain || req.get("x-shopify-shop-domain") || "",
    webhookId:
      req.shopifyWebhook?.webhookId || req.get("x-shopify-webhook-id") || "",
  };
}

function requireWebhookContext(req, { requireWebhookId = false } = {}) {
  const { topic, shopDomain, webhookId } = getWebhookContext(req);

  if (!shopDomain || (requireWebhookId && !webhookId)) {
    const error = new Error("Missing required webhook headers");
    error.statusCode = 400;
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
    if (error.code === 11000) {
      return true;
    }

    throw error;
  }
}

export const handleOrdersCreate = asyncHandler(async (req, res) => {
  const { topic, shopDomain, webhookId } = requireWebhookContext(req, {
    requireWebhookId: true,
  });

  if (await checkIdempotency(webhookId, shopDomain, topic)) {
    return res.status(200).send("Already processed");
  }

  const order = req.body;
  const io = getIo(req);
  let updated = false;

  for (const item of order.line_items || []) {
    const queryOpts = [];

    if (item.product_id) {
      queryOpts.push({ shopifyProductId: item.product_id.toString() });
    }
    if (item.variant_id) {
      queryOpts.push({ shopifyVariantId: item.variant_id.toString() });
    }
    if (item.sku) {
      queryOpts.push({ sku: item.sku });
    }

    if (queryOpts.length === 0 || !item.quantity) {
      continue;
    }

    const result = await Product.findOneAndUpdate(
      {
        $or: queryOpts,
        ...buildProductOwnerFilter(shopDomain),
      },
      {
        $inc: { stock: -item.quantity },
      },
      { new: true }
    );

    if (result) {
      updated = true;
    }
  }

  if (updated && io) {
    io.to("inventory_updates").emit("inventoryUpdated", {
      source: "orders/create",
    });
  }

  res.status(200).send("OK");
});

export const handleInventoryUpdate = asyncHandler(async (req, res) => {
  const { topic, shopDomain, webhookId } = requireWebhookContext(req, {
    requireWebhookId: true,
  });

  if (await checkIdempotency(webhookId, shopDomain, topic)) {
    return res.status(200).send("Already processed");
  }

  const payload = req.body;
  const io = getIo(req);
  const inventoryItemId = payload.inventory_item_id?.toString();
  const available = payload.available;

  if (inventoryItemId && available !== undefined) {
    const result = await Product.findOneAndUpdate(
      {
        inventoryItemId,
        ...buildProductOwnerFilter(shopDomain),
      },
      {
        stock: available,
      },
      { new: true }
    );

    if (result && io) {
      io.to("inventory_updates").emit("inventoryUpdated", {
        source: "inventory_levels/update",
      });
    }
  }

  res.status(200).send("OK");
});

export const handleProductsUpdate = asyncHandler(async (req, res) => {
  const { topic, shopDomain, webhookId } = requireWebhookContext(req, {
    requireWebhookId: true,
  });

  if (await checkIdempotency(webhookId, shopDomain, topic)) {
    return res.status(200).send("Already processed");
  }

  const productMeta = req.body;
  const io = getIo(req);
  let updated = false;

  const shopifyProductId = productMeta.id?.toString();
  if (shopifyProductId) {
    let totalStock = 0;
    let primaryVariantId = null;
    let primaryInventoryItemId = null;

    if (Array.isArray(productMeta.variants)) {
      totalStock = productMeta.variants.reduce(
        (acc, variant) => acc + (variant.inventory_quantity || 0),
        0
      );

      if (productMeta.variants.length > 0) {
        primaryVariantId = productMeta.variants[0].id?.toString();
        primaryInventoryItemId =
          productMeta.variants[0].inventory_item_id?.toString();
      }
    }

    const updateFields = { title: productMeta.title, stock: totalStock };

    if (primaryVariantId) {
      updateFields.shopifyVariantId = primaryVariantId;
    }
    if (primaryInventoryItemId) {
      updateFields.inventoryItemId = primaryInventoryItemId;
    }

    const result = await Product.findOneAndUpdate(
      {
        shopifyProductId,
        ...buildProductOwnerFilter(shopDomain),
      },
      { $set: updateFields },
      { new: true }
    );

    if (result) {
      updated = true;
    }
  }

  if (updated && io) {
    io.to("inventory_updates").emit("inventoryUpdated", {
      source: "products/update",
    });
  }

  res.status(200).send("OK");
});

export const handleAppUninstalled = asyncHandler(async (req, res) => {
  const { shopDomain } = requireWebhookContext(req);

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

export const handleCustomersDataRequest = asyncHandler(async (req, res) => {
  const { topic, shopDomain } = requireWebhookContext(req);

  console.log(`GDPR webhook received: ${topic} for ${shopDomain}`);
  console.log("Payload:", req.body);

  res.status(200).send("OK");
});

export const handleCustomersRedact = asyncHandler(async (req, res) => {
  const { topic, shopDomain } = requireWebhookContext(req);

  console.log(`GDPR webhook received: ${topic} for ${shopDomain}`);
  console.log("Payload:", req.body);

  res.status(200).send("OK");
});

export const handleShopRedact = asyncHandler(async (req, res) => {
  const { topic, shopDomain } = requireWebhookContext(req);

  console.log(`GDPR webhook received: ${topic} for ${shopDomain}`);
  console.log("Payload:", req.body);

  res.status(200).send("OK");
});
