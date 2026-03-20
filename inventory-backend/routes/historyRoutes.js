import { Router } from "express";

import { getProductHistory } from "../controllers/historyController.js";

const router = Router();

router.get("/:productId", getProductHistory);

export default router;
