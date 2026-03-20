import mongoose from "mongoose";

const inventoryHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    change: {
      type: Number,
      required: true,
    },
    action: {
      type: String,
      enum: ["added", "sold", "updated"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const InventoryHistory = mongoose.model(
  "InventoryHistory",
  inventoryHistorySchema
);

export default InventoryHistory;
