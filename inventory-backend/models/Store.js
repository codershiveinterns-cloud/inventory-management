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
    subscription: {
      id: { type: String, default: null },
      name: { type: String, default: null },
      status: { type: String, default: null },
      test: { type: Boolean, default: false },
      planType: { type: String, default: null },
      planInterval: { type: String, default: null },
      amount: { type: Number, default: null },
      currencyCode: { type: String, default: null },
      verifiedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

storeSchema.index({ user: 1, shopName: 1 }, { unique: true });

const Store = mongoose.model("Store", storeSchema);

export default Store;
