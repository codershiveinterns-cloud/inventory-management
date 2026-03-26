import Store from "../models/Store.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  SHOPIFY_ERROR_REDIRECT,
  SHOPIFY_SUCCESS_REDIRECT,
} from "../config/shopify.js";
import {
  buildShopifyAuthUrl,
  createSignedState,
  exchangeCodeForAccessToken,
  fetchShopifyProducts,
  normalizeShopDomain,
  verifyShopifyCallbackHmac,
  verifySignedState,
} from "../services/shopifyService.js";

function buildRedirectUrl(baseUrl, params = {}) {
  const target = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      target.searchParams.set(key, String(value));
    }
  });

  return target.toString();
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

export const connectShopifyStore = asyncHandler(async (req, res) => {
  const shop = normalizeShopDomain(req.query.shop || "");
  const state = createSignedState({ shop });
  const authUrl = buildShopifyAuthUrl({ shop, state });

  res.redirect(authUrl);
});

export const handleShopifyCallback = asyncHandler(async (req, res, next) => {
  try {
    const { code, shop, state } = req.query;

    if (req.query.error) {
      const error = new Error(
        req.query.error_description || req.query.error || "Shopify authorization failed"
      );
      error.statusCode = 400;
      throw error;
    }

    if (!code || !shop || !state) {
      const error = new Error("Shopify callback requires code, shop, and state");
      error.statusCode = 400;
      throw error;
    }

    verifyShopifyCallbackHmac(req.query);

    const statePayload = verifySignedState(state);
    const normalizedShop = normalizeShopDomain(shop);

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

    res.redirect(
      buildRedirectUrl(SHOPIFY_SUCCESS_REDIRECT, {
        shopify: "connected",
        shop: normalizedShop,
      })
    );
  } catch (error) {
    if (SHOPIFY_ERROR_REDIRECT) {
      return res.redirect(
        buildRedirectUrl(SHOPIFY_ERROR_REDIRECT, {
          error: error.message,
        })
      );
    }

    return next(error);
  }
});

export const getShopifyProducts = asyncHandler(async (req, res) => {
  const store = await findStoreForUser(req.user.id, req.query.shop);

  if (!store) {
    res.status(404);
    throw new Error("No Shopify store is connected for this user");
  }

  const productResponse = await fetchShopifyProducts({
    shop: store.shopName,
    accessToken: store.accessToken,
  });

  res.json({
    success: true,
    shop: store.shopName,
    count: Array.isArray(productResponse.products)
      ? productResponse.products.length
      : 0,
    data: productResponse.products || [],
  });
});
