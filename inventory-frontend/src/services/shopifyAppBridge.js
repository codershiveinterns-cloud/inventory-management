import createApp from '@shopify/app-bridge';
import { setupApiInterceptor } from './api';

const FALLBACK_SHOPIFY_API_KEY = 'bc53d1f27ef652bed3f840172a749001';

let appBridgeInstance = null;
let currentHost = '';

export const SHOPIFY_API_KEY =
  import.meta.env.VITE_SHOPIFY_API_KEY || FALLBACK_SHOPIFY_API_KEY;

export function initializeShopifyAppBridge({
  host,
  apiKey = SHOPIFY_API_KEY,
  forceRedirect = true,
} = {}) {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!host) {
    console.warn('Shopify App Bridge host parameter is missing.');
    return null;
  }

  if (!apiKey) {
    console.warn('Shopify App Bridge API key is missing.');
    return null;
  }

  if (appBridgeInstance && currentHost === host) {
    return appBridgeInstance;
  }

  appBridgeInstance = createApp({
    apiKey,
    host,
    forceRedirect,
  });
  currentHost = host;

  setupApiInterceptor(appBridgeInstance);

  return appBridgeInstance;
}
