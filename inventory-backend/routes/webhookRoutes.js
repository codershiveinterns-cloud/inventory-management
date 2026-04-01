import { Router } from "express";

import parseShopifyWebhookBody from "../middleware/parseShopifyWebhookBody.js";
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

router.post(
  "/orders/create",
  verifyShopifyWebhook,
  parseShopifyWebhookBody,
  handleOrdersCreate
);
router.post(
  "/inventory_levels/update",
  verifyShopifyWebhook,
  parseShopifyWebhookBody,
  handleInventoryUpdate
);
router.post(
  "/products/update",
  verifyShopifyWebhook,
  parseShopifyWebhookBody,
  handleProductsUpdate
);
router.post(
  "/app/uninstalled",
  verifyShopifyWebhook,
  parseShopifyWebhookBody,
  handleAppUninstalled
);

router.all(
  "/customers/data_request",
  verifyShopifyWebhook,
  parseShopifyWebhookBody,
  handleCustomersDataRequest
);
router.all(
  "/customers/redact",
  verifyShopifyWebhook,
  parseShopifyWebhookBody,
  handleCustomersRedact
);
router.all(
  "/shop/redact",
  verifyShopifyWebhook,
  parseShopifyWebhookBody,
  handleShopRedact
);

export default router;
