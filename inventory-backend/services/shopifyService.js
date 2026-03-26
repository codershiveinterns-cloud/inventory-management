import axios from "axios";
import crypto from "crypto";
import {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  SHOPIFY_API_VERSION,
  SHOPIFY_REDIRECT_URI,
  SHOPIFY_SCOPES,
  SHOPIFY_STATE_TTL_MS,
  assertShopifyEnv,
} from "../config/shopify.js";

function createShopifyApiError(error, fallbackMessage) {
  const statusCode = error?.response?.status || 502;
  const apiMessage =
    error?.response?.data?.error_description ||
    error?.response?.data?.error ||
    error?.response?.data?.errors ||
    error?.message;
  const wrappedError = new Error(apiMessage || fallbackMessage);
  wrappedError.statusCode = statusCode >= 400 ? statusCode : 502;
  return wrappedError;
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
}

function signPayload(payload) {
  return crypto
    .createHmac("sha256", SHOPIFY_API_SECRET)
    .update(payload)
    .digest("hex");
}

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function normalizeShopDomain(shop = "") {
  const normalized = shop
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");

  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(normalized)) {
    const error = new Error("A valid Shopify shop domain is required");
    error.statusCode = 400;
    throw error;
  }

  return normalized;
}

export function createSignedState({ shop, userId = null }) {
  assertShopifyEnv();

  const payload = JSON.stringify({
    shop,
    userId,
    nonce: crypto.randomBytes(12).toString("hex"),
    timestamp: Date.now(),
  });
  const encodedPayload = base64UrlEncode(payload);
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySignedState(state) {
  assertShopifyEnv();

  if (!state || !state.includes(".")) {
    const error = new Error("Invalid Shopify OAuth state");
    error.statusCode = 400;
    throw error;
  }

  const [encodedPayload, signature] = state.split(".");
  const expectedSignature = signPayload(encodedPayload);

  if (!safeCompare(signature, expectedSignature)) {
    const error = new Error("Shopify OAuth state verification failed");
    error.statusCode = 400;
    throw error;
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));

  if (!payload?.timestamp || !payload?.shop) {
    const error = new Error("Shopify OAuth state payload is incomplete");
    error.statusCode = 400;
    throw error;
  }

  if (Date.now() - payload.timestamp > SHOPIFY_STATE_TTL_MS) {
    const error = new Error("Shopify OAuth state expired");
    error.statusCode = 400;
    throw error;
  }

  return payload;
}

export function verifyShopifyCallbackHmac(query = {}) {
  assertShopifyEnv();

  const { hmac, signature, ...rest } = query;

  if (!hmac) {
    const error = new Error("Missing Shopify callback HMAC");
    error.statusCode = 400;
    throw error;
  }

  const message = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${Array.isArray(rest[key]) ? rest[key].join(",") : rest[key]}`)
    .join("&");

  const digest = crypto
    .createHmac("sha256", SHOPIFY_API_SECRET)
    .update(message)
    .digest("hex");

  if (!safeCompare(hmac, digest)) {
    const error = new Error("Invalid Shopify callback signature");
    error.statusCode = 400;
    throw error;
  }
}

export function buildShopifyAuthUrl({ shop, state }) {
  assertShopifyEnv();

  const normalizedShop = normalizeShopDomain(shop);
  const params = new URLSearchParams({
    client_id: SHOPIFY_API_KEY,
    scope: SHOPIFY_SCOPES,
    redirect_uri: SHOPIFY_REDIRECT_URI,
    state,
  });

  return `https://${normalizedShop}/admin/oauth/authorize?${params.toString()}`;
}

export async function exchangeCodeForAccessToken({ shop, code }) {
  assertShopifyEnv();

  const normalizedShop = normalizeShopDomain(shop);
  try {
    const response = await axios.post(
      `https://${normalizedShop}/admin/oauth/access_token`,
      {
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
        code,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    return response.data;
  } catch (error) {
    throw createShopifyApiError(error, "Failed to exchange Shopify OAuth code");
  }
}

export async function fetchShopifyProducts({ shop, accessToken }) {
  const normalizedShop = normalizeShopDomain(shop);
  try {
    const response = await axios.get(
      `https://${normalizedShop}/admin/api/${SHOPIFY_API_VERSION}/products.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    return response.data;
  } catch (error) {
    throw createShopifyApiError(
      error,
      "Failed to fetch products from Shopify"
    );
  }
}
