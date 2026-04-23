import Store from "../models/Store.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  SHOPIFY_ERROR_REDIRECT,
  SHOPIFY_REDIRECT_URI,
  SHOPIFY_FRONTEND_URL,
} from "../config/shopify.js";
import {
  buildEmbeddedAppHost,
  buildShopifyAuthUrl,
  createSignedState,
  exchangeCodeForAccessToken,
  fetchShopifyProducts,
  normalizeShopDomain,
  verifyShopifyCallbackHmac,
  verifySignedState,
  registerWebhooks,
  hasActiveSubscription,
  createAppSubscription,
} from "../services/shopifyService.js";

function getBackendOrigin() {
  return new URL(SHOPIFY_REDIRECT_URI).origin;
}

function buildBillingReturnUrl({ shop, host }) {
  const url = new URL("/billing/callback", getBackendOrigin());
  url.searchParams.set("shop", shop);
  if (host) url.searchParams.set("host", host);
  return url.toString();
}

async function resolveStoreByShop(shop) {
  const normalizedShop = normalizeShopDomain(shop);
  const record = await Store.findOne({ shopName: normalizedShop })
    .select("+accessToken");

  if (!record?.accessToken) {
    const error = new Error("Shopify store is not authenticated");
    error.statusCode = 401;
    throw error;
  }

  return { normalizedShop, accessToken: record.accessToken };
}

function normalizeUrl(url = "") {
  return url.trim().replace(/\/+$/, "");
}

function ensureShopifyRedirectUriConfigured() {
  if (!normalizeUrl(SHOPIFY_REDIRECT_URI)) {
    const error = new Error("SHOPIFY_REDIRECT_URI is required");
    error.statusCode = 500;
    throw error;
  }
}

function buildRedirectUrl(baseUrl, params = {}) {
  if (!baseUrl) {
    baseUrl = "/";
  }

  const isAbsolute = /^https?:\/\//i.test(baseUrl);
  const target = isAbsolute
    ? new URL(baseUrl)
    : new URL(baseUrl, "http://localhost");

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      target.searchParams.set(key, String(value));
    }
  });

  if (isAbsolute) {
    return target.toString();
  }

  return `${target.pathname}${target.search}${target.hash}`;
}

function redirectToConnect(res, params = {}) {
  if (!SHOPIFY_ERROR_REDIRECT) {
    const error = new Error(params.error || "Shopify authorization failed");
    error.statusCode = 400;
    throw error;
  }

  return res.redirect(buildRedirectUrl(SHOPIFY_ERROR_REDIRECT, params));
}

async function findStoreForUser(userId, shop) {
  const normalizedShop = shop ? normalizeShopDomain(shop) : null;

  if (normalizedShop) {
    const userStore = await Store.findOne({
      user: userId,
      shopName: normalizedShop,
    }).select("+accessToken");

    if (userStore) {
      return userStore;
    }

    return Store.findOne({
      user: null,
      shopName: normalizedShop,
    }).select("+accessToken");
  }

  const latestUserStore = await Store.findOne({ user: userId })
    .sort({ connectedAt: -1, updatedAt: -1 })
    .select("+accessToken");

  if (latestUserStore) {
    return latestUserStore;
  }

  return Store.findOne({ user: null })
    .sort({ connectedAt: -1, updatedAt: -1 })
    .select("+accessToken");
}

export const handleAppEntry = asyncHandler(async (req, res) => {
  const shopParam = req.query.shop;
  const host = req.query.host || "";

  if (!shopParam) {
    return res.json({
      success: true,
      message: "Inventory Management API is running",
    });
  }

  const shop = normalizeShopDomain(shopParam);
  const existingStore = await Store.findOne({ shopName: shop });
  const embeddedHost = host || buildEmbeddedAppHost(shop);

  if (existingStore && existingStore.accessToken) {
    return res.redirect(
      buildRedirectUrl(SHOPIFY_FRONTEND_URL || "/", {
        shop,
        host: embeddedHost,
      })
    );
  }

  return res.redirect(
    buildRedirectUrl(
      SHOPIFY_FRONTEND_URL ? `${SHOPIFY_FRONTEND_URL}/auth` : "/auth",
      {
        shop,
        host: embeddedHost,
      }
    )
  );
});

export const connectShopifyStore = asyncHandler(async (req, res) => {
  ensureShopifyRedirectUriConfigured();
  const { shop: shopParam = "", host = "" } = req.query;

  if (!shopParam) {
    return redirectToConnect(res, {
      error: "Shop is required to start Shopify OAuth",
    });
  }

  const shop = normalizeShopDomain(shopParam);
  const state = createSignedState({ shop, host });
  const authUrl = buildShopifyAuthUrl({ shop, state });

  res.redirect(authUrl);
});

export const handleShopifyCallback = asyncHandler(async (req, res, next) => {
  try {
    ensureShopifyRedirectUriConfigured();
    const { code, shop, state, host } = req.query;

    if (req.query.error) {
      return redirectToConnect(res, {
        shop: req.query.shop,
        error:
          req.query.error_description ||
          req.query.error ||
          "Shopify authorization failed",
      });
    }

    if (!code || !shop) {
      return redirectToConnect(res, {
        shop,
        error: "Shopify callback requires code and shop parameters",
      });
    }

    if (!state) {
      return redirectToConnect(res, {
        shop,
        error: "Shopify callback state is missing or invalid",
      });
    }

    verifyShopifyCallbackHmac(req.query);

    const statePayload = verifySignedState(state);
    const normalizedShop = normalizeShopDomain(shop);
    const embeddedHost =
      host || statePayload.host || buildEmbeddedAppHost(normalizedShop);

    if (normalizedShop !== statePayload.shop) {
      const error = new Error("Shopify callback shop does not match OAuth state");
      error.statusCode = 400;
      throw error;
    }

    const tokenResponse = await exchangeCodeForAccessToken({
      shop: normalizedShop,
      code,
    });

    const accessToken = tokenResponse.access_token;

    if (!accessToken) {
      const error = new Error("Shopify did not return an access token");
      error.statusCode = 502;
      throw error;
    }

    const productResponse = await fetchShopifyProducts({
      shop: normalizedShop,
      accessToken,
    });
    const products = Array.isArray(productResponse?.products)
      ? productResponse.products
      : [];

    await Store.findOneAndUpdate(
      {
        user: statePayload.userId ?? null,
        shopName: normalizedShop,
      },
      {
        user: statePayload.userId ?? null,
        shopName: normalizedShop,
        accessToken,
        scopes: (tokenResponse.scope || "")
          .split(",")
          .map((scope) => scope.trim())
          .filter(Boolean),
        connectedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log("Shopify access token stored", {
      userId: statePayload.userId ?? null,
      shop: normalizedShop,
    });
    
    // Register webhooks for real-time sync
    await registerWebhooks({ shop: normalizedShop, accessToken });

    console.log("Shopify products fetched", {
      shop: normalizedShop,
      count: products.length,
      productIds: products.slice(0, 10).map((product) => product?.id).filter(Boolean),
    });

    res.redirect(
      buildRedirectUrl(SHOPIFY_FRONTEND_URL || "/", {
        shop: normalizedShop,
        host: embeddedHost,
      })
    );
  } catch (error) {
    if (SHOPIFY_ERROR_REDIRECT) {
      return redirectToConnect(res, {
        shop: req.query.shop,
        error: error.message,
      });
    }

    return next(error);
  }
});

export const getShopifyProducts = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    shop: req.shop || "test-store.myshopify.com",
    count: 0,
    data: [],
  });
});

export const handleBillingCallback = asyncHandler(async (req, res, next) => {
  try {
    const { shop: shopParam, host } = req.query;

    if (!shopParam) {
      return redirectToConnect(res, {
        error: "Billing callback missing shop parameter",
      });
    }

    const { normalizedShop, accessToken } = await resolveStoreByShop(shopParam);
    const embeddedHost = host || buildEmbeddedAppHost(normalizedShop);
    const active = await hasActiveSubscription({
      shop: normalizedShop,
      accessToken,
    });

    res.redirect(
      buildRedirectUrl(SHOPIFY_FRONTEND_URL || "/", {
        shop: normalizedShop,
        host: embeddedHost,
        billing: active ? "active" : "declined",
      })
    );
  } catch (error) {
    if (SHOPIFY_ERROR_REDIRECT) {
      return redirectToConnect(res, {
        shop: req.query.shop,
        error: error.message,
      });
    }
    return next(error);
  }
});

export const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const shopParam = req.query.shop || req.shop;
  if (!shopParam) {
    res.status(400);
    throw new Error("shop query parameter is required");
  }

  const { normalizedShop, accessToken } = await resolveStoreByShop(shopParam);
  const active = await hasActiveSubscription({
    shop: normalizedShop,
    accessToken,
  });

  res.json({
    success: true,
    shop: normalizedShop,
    active,
  });
});

export const createBillingSubscription = asyncHandler(async (req, res) => {
  const { plan, interval } = req.body || {};
  const shopParam = req.body?.shop || req.query?.shop || req.shop;
  const host = req.body?.host || req.query?.host || "";

  if (!shopParam) {
    res.status(400);
    throw new Error("shop is required");
  }
  if (!plan || !interval) {
    res.status(400);
    throw new Error("plan and interval are required");
  }

  const { normalizedShop, accessToken } = await resolveStoreByShop(shopParam);
  const embeddedHost = host || buildEmbeddedAppHost(normalizedShop);
  const returnUrl = buildBillingReturnUrl({
    shop: normalizedShop,
    host: embeddedHost,
  });

  const { confirmationUrl, subscription, plan: resolvedPlan } =
    await createAppSubscription({
      shop: normalizedShop,
      accessToken,
      returnUrl,
      planType: plan,
      billingInterval: interval,
    });

  res.json({
    success: true,
    shop: normalizedShop,
    confirmationUrl,
    subscription,
    plan: resolvedPlan,
  });
});
