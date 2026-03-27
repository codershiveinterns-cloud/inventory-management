import { io } from "socket.io-client";

function resolveBackendBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5000';
  }

  if (!configuredUrl) {
    console.warn('VITE_API_URL is missing. Socket.io may fail to connect.');
    return '';
  }

  return configuredUrl.replace(/\/+$/, '');
}

export const socketUrl = resolveBackendBaseUrl();

export const socket = io(socketUrl, {
  autoConnect: false,
});
