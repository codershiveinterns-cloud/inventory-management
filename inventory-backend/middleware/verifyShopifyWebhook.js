import crypto from "crypto";

import { SHOPIFY_API_SECRET } from "../config/shopify.js";

function sendUnauthorized(res) {
  return res.status(401).send("HMAC validation failed");
}

export function verifyShopifyWebhook(req, res, next) {
  console.log("Webhook route hit:", {
    method: req.method,
    path: req.originalUrl,
    topic: req.get("x-shopify-topic") || "",
    shop: req.get("x-shopify-shop-domain") || "",
  });

  if (!SHOPIFY_API_SECRET) {
    return res.status(500).send("SHOPIFY_API_SECRET is not configured");
  }

  const hmacHeader = req.get("x-shopify-hmac-sha256");
  const rawBody = req.body;

  if (!hmacHeader || !Buffer.isBuffer(rawBody)) {
    console.error("Webhook HMAC validation failed: missing header or raw body", {
      path: req.originalUrl,
      hasHmac: Boolean(hmacHeader),
      isBuffer: Buffer.isBuffer(rawBody),
    });
    return sendUnauthorized(res);
  }

  const generatedHash = crypto
    .createHmac("sha256", SHOPIFY_API_SECRET)
    .update(rawBody)
    .digest("base64");

  const generatedHashBuffer = Buffer.from(generatedHash, "utf8");
  const hmacHeaderBuffer = Buffer.from(hmacHeader, "utf8");

  if (
    generatedHashBuffer.length !== hmacHeaderBuffer.length ||
    !crypto.timingSafeEqual(generatedHashBuffer, hmacHeaderBuffer)
  ) {
    console.error("Webhook HMAC validation failed: signature mismatch", {
      path: req.originalUrl,
    });
    return sendUnauthorized(res);
  }

  console.log("Webhook HMAC validation succeeded:", {
    path: req.originalUrl,
  });

  req.shopifyWebhook = {
    topic: req.get("x-shopify-topic") || "",
    shopDomain: req.get("x-shopify-shop-domain") || "",
    webhookId: req.get("x-shopify-webhook-id") || "",
  };

  next();
}

export default verifyShopifyWebhook;
