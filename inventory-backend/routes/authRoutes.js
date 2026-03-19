import { Router } from "express";

import {
  handleShopifyCallback,
  startShopifyAuth,
} from "../controllers/authController.js";

const router = Router();

router.get("/", startShopifyAuth);
router.get("/callback", handleShopifyCallback);

export default router;
