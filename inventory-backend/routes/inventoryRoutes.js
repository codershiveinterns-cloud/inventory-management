import { Router } from "express";

import {
  getInventoryLogs,
  updateInventory,
} from "../controllers/inventoryController.js";

const router = Router();

router.post("/update", updateInventory);
router.get("/logs", getInventoryLogs);

export default router;
