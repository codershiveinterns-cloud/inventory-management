import { Router } from "express";

import {
  getInventoryLogs,
  updateInventory,
} from "../controllers/inventoryController.js";
import { protect } from "../middleware/protect.js";

const router = Router();

router.use(protect);
router.post("/update", updateInventory);
router.get("/logs", getInventoryLogs);

export default router;
