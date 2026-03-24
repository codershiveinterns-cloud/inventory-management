import express from "express";

import {
  getCategoryDistribution,
  getStockTrend,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/stock-trend", getStockTrend);
router.get("/category-distribution", getCategoryDistribution);

export default router;
