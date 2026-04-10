import axios from 'axios';
import { getSessionToken } from '@shopify/app-bridge-utils';

export const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

let currentAppBridge = null;
let shopifyInterceptorAttached = false;

export function setupApiInterceptor(app) {
  currentAppBridge = app;

  if (shopifyInterceptorAttached) {
    return;
  }

  shopifyInterceptorAttached = true;

  api.interceptors.request.use(async (config) => {
    if (!currentAppBridge) {
      return config;
    }

    try {
      const token = await getSessionToken(currentAppBridge);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Shopify session token generation failed:', error.message);
    }
    return config;
  });
}

// Dev Mode Global Interceptor Bypass
api.interceptors.request.use((config) => {
  const isDevLogin = import.meta.env.VITE_DEV_LOGIN === 'true';
  if (isDevLogin) {
    const devUserStr = localStorage.getItem('dev_user');
    if (devUserStr) {
      try {
        const devUser = JSON.parse(devUserStr);
        if (devUser && devUser.accessToken) {
          config.headers.Authorization = `Bearer ${devUser.accessToken}`;
        }
      } catch (e) {
        console.error("Failed to parse dev_user", e);
      }
    }
  }
  return config;
});

export function getApiErrorMessage(error) {
  const validationErrors = error?.response?.data?.errors;

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors.map((item) => item.message ?? item.msg ?? String(item)).join(', ');
  }

  if (validationErrors && typeof validationErrors === 'object') {
    const firstMessage = Object.values(validationErrors)[0];

    if (typeof firstMessage === 'string') {
      return firstMessage;
    }

    if (firstMessage?.message) {
      return firstMessage.message;
    }
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong while talking to the API.'
  );
}

export default api;
