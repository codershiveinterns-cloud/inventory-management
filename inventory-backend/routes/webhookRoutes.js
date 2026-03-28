import { Router } from "express";

import {
  handleOrdersCreate,
  handleInventoryUpdate,
  handleProductsUpdate,
  handleAppUninstalled,
} from "../controllers/webhookController.js";

const router = Router();

router.post("/orders/create", handleOrdersCreate);
router.post("/inventory_levels/update", handleInventoryUpdate);
router.post("/products/update", handleProductsUpdate);
router.post("/app/uninstalled", handleAppUninstalled);

export default router;
