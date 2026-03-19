import { Router } from "express";

import { handleInventoryWebhook } from "../controllers/webhookController.js";

const router = Router();

router.post("/inventory-update", handleInventoryWebhook);

export default router;
