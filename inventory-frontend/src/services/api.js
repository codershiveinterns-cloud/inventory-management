import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
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
