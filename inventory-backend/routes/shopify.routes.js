import { Router } from "express";

const router = Router();

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeShopDomain(shop = "") {
  const normalized = shop
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");

  if (!normalized) {
    throw createHttpError("Query parameter 'shop' is required", 400);
  }

  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(normalized)) {
    throw createHttpError("A valid Shopify shop domain is required", 400);
  }

  return normalized;
}

function getShopifyConfig() {
  const clientId = process.env.SHOPIFY_API_KEY?.trim();
  const scopes = process.env.SHOPIFY_SCOPES?.trim();
  const redirectUri = process.env.SHOPIFY_REDIRECT_URI?.trim();

  const missing = [
    ["SHOPIFY_API_KEY", clientId],
    ["SHOPIFY_SCOPES", scopes],
    ["SHOPIFY_REDIRECT_URI", redirectUri],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw createHttpError(
      `Missing Shopify environment variables: ${missing.join(", ")}`,
      500
    );
  }

  return { clientId, scopes, redirectUri };
}

router.get("/", (req, res, next) => {
  try {
    const shop = normalizeShopDomain(req.query.shop);
    const { clientId, scopes, redirectUri } = getShopifyConfig();
    const params = new URLSearchParams({
      client_id: clientId,
      scope: scopes,
      redirect_uri: redirectUri,
    });

    res.redirect(`https://${shop}/admin/oauth/authorize?${params.toString()}`);
  } catch (error) {
    next(error);
  }
});

router.get("/callback", (req, res, next) => {
  try {
    const shop = normalizeShopDomain(req.query.shop);
    const code = `${req.query.code || ""}`.trim();

    if (!code) {
      throw createHttpError("Query parameter 'code' is required", 400);
    }

    res.status(200).json({
      success: true,
      message: "Shopify OAuth callback received successfully",
      shop,
      code,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
