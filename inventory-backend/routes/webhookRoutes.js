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

function acknowledgeUnhandledWebhook(req, res) {
  console.log("Unhandled webhook route acknowledged:", {
    method: req.method,
    path: req.originalUrl,
  });

  res.status(200).send("OK");
}

router.post("/", (_req, res) => {
  res.status(401).send("Unauthorized");
});

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

router.post(
  "/customers/data_request",
  verifyShopifyWebhook,
  parseShopifyWebhookBody,
  handleCustomersDataRequest
);
router.post(
  "/customers/redact",
  verifyShopifyWebhook,
  parseShopifyWebhookBody,
  handleCustomersRedact
);
router.post(
  "/shop/redact",
  verifyShopifyWebhook,
  parseShopifyWebhookBody,
  handleShopRedact
);

router.all("/*webhookPath", verifyShopifyWebhook, acknowledgeUnhandledWebhook);

export default router;
