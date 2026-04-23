import Store from "../models/Store.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  hasActiveSubscription,
  normalizeShopDomain,
} from "../services/shopifyService.js";

function isDevBypass(req) {
  return (
    process.env.NODE_ENV === "development" &&
    req.shop === "test-shop.myshopify.com"
  );
}

export const requireActiveBilling = asyncHandler(async (req, res, next) => {
  if (isDevBypass(req)) {
    return next();
  }

  const shopParam = req.shop || req.query.shop;
  if (!shopParam) {
    return res.status(401).json({
      success: false,
      code: "BILLING_SHOP_MISSING",
      error: "Shopify shop context is required",
    });
  }

  let normalized;
  try {
    normalized = normalizeShopDomain(shopParam);
  } catch (error) {
    return res.status(400).json({
      success: false,
      code: "BILLING_SHOP_INVALID",
      error: error.message,
    });
  }

  const store = await Store.findOne({ shopName: normalized }).select(
    "+accessToken"
  );

  if (!store?.accessToken) {
    return res.status(401).json({
      success: false,
      code: "SHOP_NOT_AUTHENTICATED",
      error: "Shopify store is not authenticated",
    });
  }

  const active = await hasActiveSubscription({
    shop: normalized,
    accessToken: store.accessToken,
  });

  if (!active) {
    if (store.subscription?.status === "ACTIVE") {
      store.subscription.status = "EXPIRED";
      store.subscription.verifiedAt = new Date();
      await store.save();
    }
    return res.status(402).json({
      success: false,
      code: "BILLING_REQUIRED",
      error: "Active subscription required",
    });
  }

  req.shop = normalized;
  next();
});
