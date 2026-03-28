import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

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

  req.shop = "test-store.myshopify.com";

  if (!req.shop) {
    return res.status(400).json({ error: "Shop is required" });
  }

  next();
});
