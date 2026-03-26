function normalizeUrl(url = "") {
  return url.trim().replace(/\/+$/, "");
}

export const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY?.trim() || "";
export const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET?.trim() || "";
export const SHOPIFY_SCOPES = process.env.SHOPIFY_SCOPES?.trim() || "";
export const SHOPIFY_REDIRECT_URI = process.env.SHOPIFY_REDIRECT_URI?.trim() || "";
export const SHOPIFY_API_VERSION =
  process.env.SHOPIFY_API_VERSION?.trim() || "2024-10";
export const SHOPIFY_STATE_TTL_MS = 10 * 60 * 1000;
export const SHOPIFY_FRONTEND_URL = normalizeUrl(
  process.env.FRONTEND_URL || "http://localhost:5173"
);
export const SHOPIFY_SUCCESS_REDIRECT =
  process.env.SHOPIFY_SUCCESS_REDIRECT?.trim() ||
  `${SHOPIFY_FRONTEND_URL}/app`;
export const SHOPIFY_ERROR_REDIRECT =
  process.env.SHOPIFY_ERROR_REDIRECT?.trim() ||
  `${SHOPIFY_FRONTEND_URL}/shopify/connect`;

export function assertShopifyEnv() {
  const missing = [
    ["SHOPIFY_API_KEY", SHOPIFY_API_KEY],
    ["SHOPIFY_API_SECRET", SHOPIFY_API_SECRET],
    ["SHOPIFY_SCOPES", SHOPIFY_SCOPES],
    ["SHOPIFY_REDIRECT_URI", SHOPIFY_REDIRECT_URI],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    const error = new Error(
      `Missing Shopify environment variables: ${missing.join(", ")}`
    );
    error.statusCode = 500;
    throw error;
  }
}
