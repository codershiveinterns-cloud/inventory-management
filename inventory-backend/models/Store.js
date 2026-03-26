import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    shopName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    accessToken: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    scopes: {
      type: [String],
      default: [],
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

storeSchema.index({ user: 1, shopName: 1 }, { unique: true });

const Store = mongoose.model("Store", storeSchema);

export default Store;
