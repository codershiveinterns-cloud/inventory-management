import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

const defaultCategories = ["Electronics", "Grocery", "Clothing", "Other"];

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Product.distinct("category", {
    category: { $exists: true, $ne: "" },
  });

  const mergedCategories = [...new Set([...defaultCategories, ...categories])];

  res.json({
    success: true,
    count: mergedCategories.length,
    data: mergedCategories,
  });
});
