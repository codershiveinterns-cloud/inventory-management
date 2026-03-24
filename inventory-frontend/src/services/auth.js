import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const PASSWORD_RULES = [
  {
    test: (value) => value.length >= 8,
    message: 'Password must be at least 8 characters long.'
  },
  {
    test: (value) => /[A-Z]/.test(value),
    message: 'Password must include at least 1 uppercase letter.'
  },
  {
    test: (value) => /\d/.test(value),
    message: 'Password must include at least 1 number.'
  },
  {
    test: (value) => /[^A-Za-z0-9]/.test(value),
    message: 'Password must include at least 1 special character.'
  }
];

function createAuthError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function validatePasswordStrength(password = '') {
  const failedRule = PASSWORD_RULES.find((rule) => !rule.test(password));

  if (failedRule) {
    throw createAuthError('auth/weak-password-policy', failedRule.message);
  }
}

export async function registerUser(email, password, options = {}) {
  validatePasswordStrength(password);

  const credentials = await createUserWithEmailAndPassword(auth, email, password);

  if (options.fullName?.trim()) {
    await updateProfile(credentials.user, { displayName: options.fullName.trim() });
  }

  await sendEmailVerification(credentials.user);
  await signOut(auth);

  return {
    email: credentials.user.email,
    verificationSent: true
  };
}

export async function loginUser(email, password) {
  const credentials = await signInWithEmailAndPassword(auth, email, password);

  await reload(credentials.user);

  if (!credentials.user.emailVerified) {
    await signOut(auth);
    throw createAuthError(
      'auth/email-not-verified',
      'Please verify your email before logging in'
    );
  }

  return credentials.user;
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
  return {
    success: true,
    message: 'Password reset email sent'
  };
}

export function logoutUser() {
  return signOut(auth);
}

export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export function getAuthErrorMessage(error) {
  switch (error?.code) {
    case 'auth/email-already-in-use':
      return 'That email is already in use. Try logging in instead.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/missing-email':
      return 'Enter your email address first.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'The email or password is incorrect.';
    case 'auth/user-not-found':
      return 'We could not find an account with that email address.';
    case 'auth/weak-password':
    case 'auth/weak-password-policy':
      return error.message || 'Use a stronger password.';
    case 'auth/email-not-verified':
      return 'Please verify your email before logging in';
    case 'auth/too-many-requests':
      return 'Too many attempts were made. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Unable to reach Firebase right now. Check your connection and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    default:
      return error?.message ?? 'Something went wrong while signing you in.';
  }
}
