import { Router } from "express";

import { getCategories } from "../controllers/categoryController.js";
import { protect } from "../middleware/protect.js";

const router = Router();

router.use(protect);
router.get("/", getCategories);

export default router;
