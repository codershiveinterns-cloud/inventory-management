import { DUPLICATE_SKU_MESSAGE } from "../utils/sku.js";

const errorHandler = (err, req, res, _next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  if (err.code === 11000) {
    err.statusCode = 409;
    const duplicateFields = Object.keys(err.keyValue || {});
    err.message = duplicateFields.includes("sku")
      ? DUPLICATE_SKU_MESSAGE
      : `Duplicate value for ${duplicateFields.join(", ")}`;
  }

  if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = "Invalid resource id";
  }

  const statusCode = err.statusCode || res.statusCode || 500;

  console.error("API error:", {
    method: req.method,
    path: req.originalUrl,
    statusCode: statusCode === 200 ? 500 : statusCode,
    name: err.name,
    code: err.code,
    message: err.message,
    keyValue: err.keyValue,
    stack: err.stack,
  });

  res.status(statusCode === 200 ? 500 : statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default errorHandler;
