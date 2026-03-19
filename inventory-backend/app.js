import express from "express";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Core middleware for cross-origin requests and JSON request bodies.
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Inventory Management API is running",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/auth", authRoutes);
app.use("/webhooks", webhookRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
