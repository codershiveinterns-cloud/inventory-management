import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    changeType: {
      type: String,
      enum: ["increase", "decrease"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
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

const InventoryLog = mongoose.model("InventoryLog", inventoryLogSchema);

export default InventoryLog;
