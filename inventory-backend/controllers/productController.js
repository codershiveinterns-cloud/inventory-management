import Product from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";
import asyncHandler from "../utils/asyncHandler.js";
import { createInventoryLog, getChangeDetailsFromDelta } from "../utils/inventory.js";
import { DUPLICATE_SKU_MESSAGE, normalizeSku } from "../utils/sku.js";

const ensureSkuIsAvailable = async ({ sku, excludeProductId }) => {
  if (!sku) {
    return;
  }

  const existingProduct = await Product.findOne({
    sku,
    ...(excludeProductId ? { _id: { $ne: excludeProductId } } : {}),
  }).select("_id");

  if (existingProduct) {
    const error = new Error(DUPLICATE_SKU_MESSAGE);
    error.statusCode = 409;
    throw error;
  }
};

const normalizeLowStockThreshold = (value, { required = false } = {}) => {
  if (value === undefined) {
    if (required) {
      const error = new Error("lowStockThreshold is required");
      error.statusCode = 400;
      throw error;
    }

    return undefined;
  }

  const numericLowStockThreshold = Number(value);

  if (
    !Number.isFinite(numericLowStockThreshold) ||
    numericLowStockThreshold < 0
  ) {
    const error = new Error(
      "lowStockThreshold must be a non-negative number"
    );
    error.statusCode = 400;
    throw error;
  }

  return numericLowStockThreshold;
};

// Create a new product and record the initial stock as an inventory event.
export const createProduct = asyncHandler(async (req, res) => {
  const { title, sku, stock, price, lowStockThreshold } = req.body;
  const normalizedSku = normalizeSku(sku);
  const normalizedLowStockThreshold = normalizeLowStockThreshold(
    lowStockThreshold,
    { required: true }
  );

  await ensureSkuIsAvailable({ sku: normalizedSku });

  const product = await Product.create({
    title,
    sku: normalizedSku,
    stock,
    price,
    lowStockThreshold: normalizedLowStockThreshold,
  });

  await createInventoryLog({
    productId: product._id,
    changeType: "increase",
    quantity: product.stock,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

// Fetch all products for dashboard or listing screens.
export const getProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    count: products.length,
    data: products,
  });
});

// Return products whose stock has fallen below the configured threshold.
export const getLowStockProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({
    $expr: { $lte: ["$stock", "$lowStockThreshold"] },
  }).sort({ stock: 1, title: 1 });

  res.json({
    success: true,
    count: products.length,
    data: products,
  });
});

// Fetch a single product by its MongoDB id.
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({
    success: true,
    data: product,
  });
});

// Update product details and log stock movements when inventory changes.
export const updateProduct = asyncHandler(async (req, res) => {
  const { title, sku, stock, price, lowStockThreshold, change } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (stock !== undefined && change !== undefined) {
    res.status(400);
    throw new Error("Provide either stock or change, not both");
  }

  let stockDelta = 0;

  if (change !== undefined) {
    const numericChange = Number(change);

    if (Number.isNaN(numericChange) || numericChange === 0) {
      res.status(400);
      throw new Error("Change must be a non-zero number");
    }

    const updatedStock = product.stock + numericChange;

    if (updatedStock < 0) {
      res.status(400);
      throw new Error("Stock cannot go below zero");
    }

    stockDelta = numericChange;
    product.stock = updatedStock;
  }

  if (stock !== undefined) {
    const numericStock = Number(stock);

    if (Number.isNaN(numericStock) || numericStock < 0) {
      res.status(400);
      throw new Error("Stock must be a valid non-negative number");
    }

    stockDelta = numericStock - product.stock;
    product.stock = numericStock;
  }

  if (title !== undefined) {
    product.title = title;
  }

  if (sku !== undefined) {
    const normalizedSku = normalizeSku(sku);

    await ensureSkuIsAvailable({
      sku: normalizedSku,
      excludeProductId: product._id,
    });

    product.sku = normalizedSku;
  }

  if (price !== undefined) {
    product.price = price;
  }

  if (lowStockThreshold !== undefined) {
    product.lowStockThreshold = normalizeLowStockThreshold(lowStockThreshold);
  }

  const updatedProduct = await product.save();
  const changeDetails = getChangeDetailsFromDelta(stockDelta);

  if (changeDetails) {
    await createInventoryLog({
      productId: updatedProduct._id,
      changeType: changeDetails.changeType,
      quantity: changeDetails.quantity,
    });
  }

  res.json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

// Delete a product and clean up related inventory logs.
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await InventoryLog.deleteMany({ productId: product._id });
  await product.deleteOne();

  res.json({
    success: true,
    message: "Product deleted successfully",
  });
});
