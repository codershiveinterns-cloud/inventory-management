import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const DEFAULT_FIREBASE_UID = "local_default_user_uid";

export const protect = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { firebaseUid: DEFAULT_FIREBASE_UID },
    {
      firebaseUid: DEFAULT_FIREBASE_UID,
      email: "admin@local.com",
      displayName: "Admin User",
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  req.user = {
    id: user._id.toString(),
    firebaseUid: user.firebaseUid,
    email: user.email,
    displayName: user.displayName,
  };

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  // Dev Bypass
  if (process.env.NODE_ENV === 'development' && token === 'dev_token_123') {
    req.shop = 'test-shop.myshopify.com';
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET);
    const shop = decoded.dest.replace("https://", "");
    req.shop = shop;
  } catch (error) {
    return res.status(401).json({ error: "Invalid session token" });
  }

  next();
});
