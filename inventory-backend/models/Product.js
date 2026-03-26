import mongoose from "mongoose";
import { DEFAULT_CURRENCY } from "../config/currency.js";
import { normalizeSku } from "../utils/sku.js";

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product owner is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      alias: "name",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Electronics", "Grocery", "Clothing", "Other"],
      trim: true,
      default: "Other",
    },
    sku: {
      type: String,
      set: normalizeSku,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
      alias: "quantity",
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => value > 0,
        message: "Price must be positive",
      },
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      enum: ["EUR"],
      default: DEFAULT_CURRENCY,
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

productSchema.index(
  { user: 1, sku: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sku: { $exists: true, $type: "string" },
    },
  }
);

productSchema.pre("validate", function setDefaultCategory() {
  if (!this.category) {
    this.category = "Other";
  }
});

productSchema.pre("init", function setLegacyCategory(document) {
  if (!document.category) {
    document.category = "Other";
  }
});

productSchema.virtual("isLowStock").get(function isLowStock() {
  return this.stock <= this.lowStockThreshold;
});

const Product = mongoose.model("Product", productSchema);

export default Product;
