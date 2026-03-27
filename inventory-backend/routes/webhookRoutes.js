import { Router } from "express";

import {
  handleOrdersCreate,
  handleInventoryUpdate,
  handleProductsUpdate,
} from "../controllers/webhookController.js";

const router = Router();

router.post("/orders/create", handleOrdersCreate);
router.post("/inventory_levels/update", handleInventoryUpdate);
router.post("/products/update", handleProductsUpdate);

export default router;
