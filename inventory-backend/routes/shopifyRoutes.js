import { Router } from "express";

import { protect } from "../middleware/protect.js";
import {
  connectShopifyStore,
  getShopifyProducts,
  handleShopifyCallback,
  handleAppEntry,
  handleBillingEntry,
  handleBillingCallback,
  createBillingSubscription,
  getSubscriptionStatus,
} from "../controllers/shopifyController.js";

const router = Router();

router.get("/", handleAppEntry);

router.get("/auth", connectShopifyStore);
router.get("/auth/callback", handleShopifyCallback);

router.get("/billing", handleBillingEntry);
router.post("/billing/create", createBillingSubscription);
router.get("/billing/status", getSubscriptionStatus);
router.get("/billing/callback", handleBillingCallback);

router.get("/products", protect, getShopifyProducts);

export default router;
