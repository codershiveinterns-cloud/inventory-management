import Product, { buildProductOwnerFilter } from "../models/Product.js";
import InventoryHistory from "../models/InventoryHistory.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProductHistory = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.productId,
    ...buildProductOwnerFilter(req.user.id),
  }).select("_id");

  if (!product) {
    const existingProduct = await Product.exists({ _id: req.params.productId });
    res.status(existingProduct ? 403 : 404);
    throw new Error(existingProduct ? "Unauthorized" : "Product not found");
  }

  const history = await InventoryHistory.find({
    productId: product._id,
  }).sort({ date: -1, createdAt: -1 });

  res.json({
    success: true,
    count: history.length,
    data: history,
  });
});
