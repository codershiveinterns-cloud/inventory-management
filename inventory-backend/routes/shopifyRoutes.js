import { Router } from "express";

import { protect } from "../middleware/protect.js";
import {
  connectShopifyStore,
  getShopifyProducts,
  handleShopifyCallback,
  handleBillingCallback,
  createBillingSubscription,
  getSubscriptionStatus,
} from "../controllers/shopifyController.js";

const router = Router();

router.get("/auth", connectShopifyStore);
router.get("/auth/callback", handleShopifyCallback);

router.post("/billing/create", createBillingSubscription);
router.get("/billing/status", getSubscriptionStatus);
router.get("/billing/callback", handleBillingCallback);

router.get("/products", protect, getShopifyProducts);

export default router;
