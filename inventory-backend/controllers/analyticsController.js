import Product, { buildProductOwnerFilter } from "../models/Product.js";
import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";

export const getStockTrend = asyncHandler(async (req, res) => {
  const shop = req.shop;
  const stockTrend = await Product.aggregate([
    {
      $match: buildProductOwnerFilter(shop),
    },
    {
      $project: {
        quantity: { $ifNull: ["$stock", 0] },
        updatedDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$updatedAt",
          },
        },
      },
    },
    {
      $group: {
        _id: "$updatedDate",
        totalQuantity: { $sum: "$quantity" },
        productCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        label: "$_id",
        totalQuantity: 1,
        productCount: 1,
        value: "$totalQuantity",
      },
    },
  ]);

  console.log("GET /api/analytics/stock-trend response:", stockTrend);

  res.json({
    success: true,
    count: stockTrend.length,
    data: stockTrend,
  });
});

export const getCategoryDistribution = asyncHandler(async (req, res) => {
  const shop = req.shop;
  const categoryDistribution = await Product.aggregate([
    {
      $match: buildProductOwnerFilter(shop),
    },
    {
      $project: {
        category: {
          $cond: [
            { $eq: [{ $ifNull: ["$category", ""] }, ""] },
            "Other",
            { $ifNull: ["$category", "Other"] },
          ],
        },
        quantity: { $ifNull: ["$stock", 0] },
      },
    },
    {
      $group: {
        _id: "$category",
        productCount: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" },
      },
    },
    { $sort: { totalQuantity: -1, _id: 1 } },
    {
      $project: {
        _id: 0,
        category: "$_id",
        name: "$_id",
        productCount: 1,
        totalQuantity: 1,
        value: "$totalQuantity",
      },
    },
  ]);

  console.log(
    "GET /api/analytics/category-distribution response:",
    categoryDistribution
  );

  res.json({
    success: true,
    count: categoryDistribution.length,
    data: categoryDistribution,
  });
});
