import mongoose from "mongoose";
import { normalizeSku } from "../utils/sku.js";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      set: normalizeSku,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => value > 0,
        message: "Price must be positive",
      },
    },
    lowStockThreshold: {
      type: Number,
      required: [true, "lowStockThreshold is required"],
      min: [0, "Low stock threshold must be a non-negative number"],
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("isLowStock").get(function isLowStock() {
  return this.stock <= this.lowStockThreshold;
});

const Product = mongoose.model("Product", productSchema);

export default Product;
