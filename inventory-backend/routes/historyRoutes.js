import { Router } from "express";

import { getProductHistory } from "../controllers/historyController.js";
import { protect } from "../middleware/protect.js";

const router = Router();

router.use(protect);
router.get("/:productId", getProductHistory);

export default router;
