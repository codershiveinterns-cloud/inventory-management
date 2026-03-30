import { Router } from "express";

import { protect } from "../middleware/protect.js";
import {
  connectShopifyStore,
  getShopifyProducts,
  handleShopifyCallback,
} from "../controllers/shopifyController.js";

const router = Router();

router.get("/auth", connectShopifyStore);
router.get("/auth/callback", handleShopifyCallback);
router.get("/products", protect, getShopifyProducts);

export default router;
