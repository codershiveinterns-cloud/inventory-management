import crypto from "crypto";

import { SHOPIFY_API_SECRET } from "../config/shopify.js";

function sendUnauthorized(res) {
  return res.status(401).send("HMAC validation failed");
}

export function verifyShopifyWebhook(req, res, next) {
  if (!SHOPIFY_API_SECRET) {
    return res.status(500).send("SHOPIFY_API_SECRET is not configured");
  }

  const hmacHeader = req.get("x-shopify-hmac-sha256");

  if (!hmacHeader || !req.rawBody) {
    return sendUnauthorized(res);
  }

  const generatedHash = crypto
    .createHmac("sha256", SHOPIFY_API_SECRET)
    .update(req.rawBody)
    .digest("base64");

  const generatedHashBuffer = Buffer.from(generatedHash, "utf8");
  const hmacHeaderBuffer = Buffer.from(hmacHeader, "utf8");

  if (
    generatedHashBuffer.length !== hmacHeaderBuffer.length ||
    !crypto.timingSafeEqual(generatedHashBuffer, hmacHeaderBuffer)
  ) {
    return sendUnauthorized(res);
  }

  req.shopifyWebhook = {
    topic: req.get("x-shopify-topic") || "",
    shopDomain: req.get("x-shopify-shop-domain") || "",
    webhookId: req.get("x-shopify-webhook-id") || "",
  };

  next();
}

export default verifyShopifyWebhook;
