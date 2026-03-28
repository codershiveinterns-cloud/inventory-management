import mongoose from "mongoose";
import { DEFAULT_CURRENCY } from "../config/currency.js";
import { normalizeSku } from "../utils/sku.js";

const productSchema = new mongoose.Schema(
  {
    shop: {
      type: String,
      required: [true, "Shop domain is required"],
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
    shopifyProductId: {
      type: String,
      index: true,
    },
    shopifyVariantId: {
      type: String,
      index: true,
    },
    inventoryItemId: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index(
  { shop: 1, sku: 1 },
  {
    unique: true,
    partialFilterExpression: {
      sku: { $exists: true, $type: "string" },
      shop: { $exists: true, $type: "string" },
    },
  }
);

productSchema.pre("validate", function normalizeCategory() {
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

export function buildProductOwnerFilter(shop) {
  return { shop };
}

export function buildOwnedProductQuery(productId, shop) {
  return {
    _id: productId,
    ...buildProductOwnerFilter(shop),
  };
}

const Product = mongoose.model("Product", productSchema);

export default Product;
