import asyncHandler from "../utils/asyncHandler.js";

// Placeholder endpoint for future Shopify or third-party inventory webhooks.
export const handleInventoryWebhook = asyncHandler(async (req, res) => {
  res.status(202).json({
    success: true,
    message: "Inventory webhook received",
    receivedPayload: req.body,
    nextStep:
      "Add webhook signature verification and inventory sync logic here.",
  });
});
