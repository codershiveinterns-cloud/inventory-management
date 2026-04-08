import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = async () => {
  try {
    await connectDB();

    const server = createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
      },
    });

    app.set("io", io);

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("joinGlobal", () => {
        socket.join("inventory_updates");
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    // React Frontend Serving (MUST be at the bottom before listen)
    app.use(express.static(path.join(__dirname, "build")));

    // Fallback React SPA route correctly resolving for Express 5 compatibility
    app.use((req, res, next) => {
      if (req.method === 'GET') {
        res.sendFile(path.join(__dirname, "build", "index.html"));
      } else {
        next();
      }
    });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();