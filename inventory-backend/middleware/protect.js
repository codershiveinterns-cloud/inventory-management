import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getFirebaseAdminAuth } from "../config/firebaseAdmin.js";

function getBearerToken(headerValue = "") {
  if (!headerValue.startsWith("Bearer ")) {
    return null;
  }

  const token = headerValue.slice("Bearer ".length).trim();
  return token || null;
}

export const protect = asyncHandler(async (req, res, next) => {
  const token = getBearerToken(req.headers.authorization || "");

  if (!token) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  let decodedToken;

  try {
    decodedToken = await getFirebaseAdminAuth().verifyIdToken(token);
  } catch (error) {
    if (error?.statusCode && error.statusCode >= 500) {
      throw error;
    }

    res.status(401);
    throw new Error("Unauthorized");
  }

  const user = await User.findOneAndUpdate(
    { firebaseUid: decodedToken.uid },
    {
      firebaseUid: decodedToken.uid,
      email: decodedToken.email ?? "",
      displayName: decodedToken.name ?? "",
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

  next();
});
