import Product from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  createInventoryLog,
  validateChangeType,
  validateQuantity,
} from "../utils/inventory.js";

// Update inventory by increasing or decreasing stock through a dedicated API.
export const updateInventory = asyncHandler(async (req, res) => {
  const { productId, quantity, type } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("productId is required");
  }

  let normalizedQuantity;
  let normalizedType;

  try {
    normalizedQuantity = validateQuantity(quantity);
    normalizedType = validateChangeType(type);
  } catch (error) {
    res.status(400);
    throw error;
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const nextStock =
    normalizedType === "increase"
      ? product.stock + normalizedQuantity
      : product.stock - normalizedQuantity;

  if (nextStock < 0) {
    res.status(400);
    throw new Error("Stock cannot go below 0");
  }

  product.stock = nextStock;
  const updatedProduct = await product.save();

  const log = await createInventoryLog({
    productId: updatedProduct._id,
    changeType: normalizedType,
    quantity: normalizedQuantity,
  });

  res.json({
    success: true,
    message: "Inventory updated successfully",
    data: {
      product: updatedProduct,
      log,
    },
  });
});

// Optional helper endpoint for auditing recent stock movement.
export const getInventoryLogs = asyncHandler(async (_req, res) => {
  const logs = await InventoryLog.find()
    .populate("productId", "title sku")
    .sort({ date: -1, createdAt: -1 });

  res.json({
    success: true,
    count: logs.length,
    data: logs,
  });
});
