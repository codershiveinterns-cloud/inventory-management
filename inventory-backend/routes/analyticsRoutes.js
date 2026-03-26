import express from "express";

import {
  getCategoryDistribution,
  getStockTrend,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.use(protect);
router.get("/stock-trend", getStockTrend);
router.get("/category-distribution", getCategoryDistribution);

export default router;
