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

function getQueryToken(queryValue) {
  if (typeof queryValue !== "string") {
    return null;
  }

  const token = queryValue.trim();
  return token || null;
}

export async function authenticateRequest(
  req,
  { allowQueryToken = false } = {}
) {
  const token =
    getBearerToken(req.headers.authorization || "") ||
    (allowQueryToken ? getQueryToken(req.query.idToken) : null);

  if (!token) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  let decodedToken;

  try {
    decodedToken = await getFirebaseAdminAuth().verifyIdToken(token);
  } catch (error) {
    if (error?.statusCode && error.statusCode >= 500) {
      throw error;
    }

    const unauthorizedError = new Error("Unauthorized");
    unauthorizedError.statusCode = 401;
    throw unauthorizedError;
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
}

export const protect = asyncHandler(async (req, res, next) => {
  await authenticateRequest(req);
  next();
});
