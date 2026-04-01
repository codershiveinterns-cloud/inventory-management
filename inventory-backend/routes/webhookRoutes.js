import { Router } from "express";

import verifyShopifyWebhook from "../middleware/verifyShopifyWebhook.js";
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

router.post("/orders/create", verifyShopifyWebhook, handleOrdersCreate);
router.post(
  "/inventory_levels/update",
  verifyShopifyWebhook,
  handleInventoryUpdate
);
router.post("/products/update", verifyShopifyWebhook, handleProductsUpdate);
router.post("/app/uninstalled", verifyShopifyWebhook, handleAppUninstalled);

router.post(
  "/customers/data_request",
  verifyShopifyWebhook,
  handleCustomersDataRequest
);
router.post("/customers/redact", verifyShopifyWebhook, handleCustomersRedact);
router.post("/shop/redact", verifyShopifyWebhook, handleShopRedact);

export default router;
