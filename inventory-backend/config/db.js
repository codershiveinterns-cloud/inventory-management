import mongoose from "mongoose";
import { DEFAULT_CURRENCY } from "./currency.js";
import Product from "../models/Product.js";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  await mongoose.connect(mongoUri);
  await Product.updateMany(
    {
      $or: [{ currency: { $exists: false } }, { currency: { $ne: DEFAULT_CURRENCY } }],
    },
    {
      $set: { currency: DEFAULT_CURRENCY },
    }
  );
  await Product.syncIndexes();
  console.log("MongoDB connected successfully");
};

export default connectDB;
