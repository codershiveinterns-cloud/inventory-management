import express from "express";

import { getDashboardAnalytics } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(`Dashboard API hit: ${req.method} ${req.originalUrl}`);
  next();
}, getDashboardAnalytics);

export default router;
