import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";
import User from "../models/User.js";
import sampleProducts from "../data/sampleProducts.js";

dotenv.config();

const seedSampleData = async () => {
  try {
    await connectDB();

    await InventoryLog.deleteMany();
    await Product.deleteMany();
    await User.deleteMany({ firebaseUid: "seed-user" });

    const seedUser = await User.create({
      firebaseUid: "seed-user",
      email: "seed@example.com",
      displayName: "Seed User",
    });

    const createdProducts = await Product.insertMany(
      sampleProducts.map((product) => ({
        ...product,
        user: seedUser._id,
      }))
    );

    const logPayload = createdProducts
      .filter((product) => product.stock > 0)
      .map((product) => ({
        productId: product._id,
        changeType: "increase",
        quantity: product.stock,
        date: new Date(),
      }));

    if (logPayload.length > 0) {
      await InventoryLog.insertMany(logPayload);
    }

    console.log(`Seeded ${createdProducts.length} products successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed sample data:", error.message);
    process.exit(1);
  }
};

seedSampleData();
