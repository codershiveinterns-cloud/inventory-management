import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardAnalytics = asyncHandler(async (_req, res) => {
  const [analytics] = await Product.aggregate([
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalProducts: { $sum: 1 },
              totalStock: { $sum: "$stock" },
              lowStockCount: {
                $sum: {
                  $cond: [{ $lte: ["$stock", "$lowStockThreshold"] }, 1, 0],
                },
              },
            },
          },
        ],
        recentUpdates: [
          { $sort: { updatedAt: -1 } },
          { $limit: 5 },
          {
            $addFields: {
              isLowStock: { $lte: ["$stock", "$lowStockThreshold"] },
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        totalProducts: {
          $ifNull: [{ $arrayElemAt: ["$totals.totalProducts", 0] }, 0],
        },
        totalStock: {
          $ifNull: [{ $arrayElemAt: ["$totals.totalStock", 0] }, 0],
        },
        lowStockCount: {
          $ifNull: [{ $arrayElemAt: ["$totals.lowStockCount", 0] }, 0],
        },
        recentUpdates: 1,
      },
    },
  ]);

  res.json(
    analytics || {
      totalProducts: 0,
      totalStock: 0,
      lowStockCount: 0,
      recentUpdates: [],
    }
  );
});
