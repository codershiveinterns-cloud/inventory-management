import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    accessToken: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", storeSchema);

export default Store;
