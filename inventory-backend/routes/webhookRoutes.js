import { Router } from "express";

import {
  handleOrdersCreate,
  handleInventoryUpdate,
  handleProductsUpdate,
  handleAppUninstalled,
  handleCustomersDataRequest,
  handleCustomersRedact,
  handleShopRedact
} from "../controllers/webhookController.js";

const router = Router();

router.post("/orders/create", handleOrdersCreate);
router.post("/inventory_levels/update", handleInventoryUpdate);
router.post("/products/update", handleProductsUpdate);
router.post("/app/uninstalled", handleAppUninstalled);

router.post("/customers/data_request", handleCustomersDataRequest);
router.post("/customers/redact", handleCustomersRedact);
router.post("/shop/redact", handleShopRedact);

export default router;
