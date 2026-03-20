import InventoryHistory from "../models/InventoryHistory.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProductHistory = asyncHandler(async (req, res) => {
  const history = await InventoryHistory.find({
    productId: req.params.productId,
  }).sort({ date: -1, createdAt: -1 });

  res.json({
    success: true,
    count: history.length,
    data: history,
  });
});
