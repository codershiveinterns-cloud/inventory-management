import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getFirebaseAdminConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId) {
    const error = new Error(
      "Firebase Admin is not configured. Set FIREBASE_PROJECT_ID at minimum."
    );
    error.statusCode = 500;
    throw error;
  }

  if (clientEmail && privateKey) {
    return {
      projectId,
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    };
  }

  return { projectId };
}

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp(getFirebaseAdminConfig());
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}
