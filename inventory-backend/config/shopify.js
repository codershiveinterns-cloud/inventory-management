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
  process.env.FRONTEND_URL ||
    process.env.APP_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    ""
);
export const SHOPIFY_SUCCESS_REDIRECT =
  process.env.SHOPIFY_SUCCESS_REDIRECT?.trim() ||
  SHOPIFY_FRONTEND_URL;
export const SHOPIFY_ERROR_REDIRECT =
  process.env.SHOPIFY_ERROR_REDIRECT?.trim() ||
  (SHOPIFY_FRONTEND_URL ? `${SHOPIFY_FRONTEND_URL}/connect` : "/connect");

export const SHOPIFY_BILLING_TRIAL_DAYS =
  Number.parseInt(process.env.SHOPIFY_BILLING_TRIAL_DAYS, 10) || 0;
export const SHOPIFY_BILLING_TEST =
  (process.env.SHOPIFY_BILLING_TEST ?? "true").toString().toLowerCase() !== "false";

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
