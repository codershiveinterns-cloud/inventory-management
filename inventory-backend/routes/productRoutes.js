import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getProductById,
  getLowStockProducts,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/protect.js";

const router = Router();

router.use(protect);
router.get("/low-stock", getLowStockProducts);
router.route("/").post(createProduct).get(getProducts);
router.route("/:id").get(getProductById).put(updateProduct).delete(deleteProduct);

export default router;
