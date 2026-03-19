import Store from "../models/Store.js";
import asyncHandler from "../utils/asyncHandler.js";

// Placeholder route for starting Shopify OAuth.
export const startShopifyAuth = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "Shopify OAuth placeholder route",
    nextStep:
      "Replace this response with Shopify's OAuth redirect when integration is ready.",
    shop: req.query.shop || null,
  });
});

// Placeholder callback that can already persist a shop/access token structure.
export const handleShopifyCallback = asyncHandler(async (req, res) => {
  const shopName = req.query.shop || req.query.shopName;
  const accessToken =
    req.query.accessToken || process.env.SHOPIFY_ACCESS_TOKEN_PLACEHOLDER;

  if (!shopName) {
    res.status(400);
    throw new Error("shop or shopName query parameter is required");
  }

  if (!accessToken) {
    res.status(400);
    throw new Error(
      "accessToken query parameter or SHOPIFY_ACCESS_TOKEN_PLACEHOLDER env value is required"
    );
  }

  const store = await Store.findOneAndUpdate(
    { shopName },
    { shopName, accessToken },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.json({
    success: true,
    message: "Shopify callback placeholder completed",
    data: store,
  });
});
