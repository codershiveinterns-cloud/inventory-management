import mongoose from "mongoose";
import Product from "../models/Product.js";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  await mongoose.connect(mongoUri);
  await Product.syncIndexes();
  console.log("MongoDB connected successfully");
};

export default connectDB;
