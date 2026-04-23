import "dotenv/config";
import express from "express";
import cors from "cors";

import analyticsRoutes from "./routes/analyticsRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import shopifyRoutes from "./routes/shopifyRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import { protect } from "./middleware/protect.js";
import { requireActiveBilling } from "./middleware/billingGuard.js";

const app = express();

function normalizeOrigin(origin = "") {
  return origin.trim().replace(/\/+$/, "");
}

const configuredOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URLS]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map(normalizeOrigin)
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  const isLocalhostOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/i.test(normalizedOrigin);
  const isRenderOrigin = /^https:\/\/[a-z0-9-]+\.onrender\.com$/i.test(normalizedOrigin);

  return (
    isLocalhostOrigin ||
    isRenderOrigin ||
    configuredOrigins.includes(normalizedOrigin)
  );
}

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Core middleware for cross-origin requests and JSON request bodies.
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use("/webhooks", express.raw({ type: "*/*" }));
app.use("/webhooks", webhookRoutes);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", protect, requireActiveBilling);

app.use("/api/categories", categoryRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/", shopifyRoutes);

app.use((req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
    return notFound(req, res, next);
  }
  next(); // Passes the route off to server.js bindings for React App
});
app.use(errorHandler);

export default app;
