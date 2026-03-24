import { createContext, useContext, useEffect, useState } from 'react';
import {
  getAuthErrorMessage,
  loginUser,
  resetPassword,
  logoutUser,
  registerUser,
  watchAuthState
} from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = watchAuthState((nextUser) => {
      setUser(nextUser);
      setIsAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login(credentials) {
    return loginUser(credentials.email, credentials.password);
  }

  async function signup(credentials) {
    return registerUser(credentials.email, credentials.password, {
      fullName: credentials.fullName
    });
  }

  async function logout() {
    return logoutUser();
  }

  async function forgotPassword(email) {
    return resetPassword(email);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading,
        isAuthenticated: Boolean(user?.emailVerified),
        login,
        signup,
        forgotPassword,
        logout,
        getAuthErrorMessage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
}
