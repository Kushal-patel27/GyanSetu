import axios from "axios";

/**
 * Centralized Axios instance for all API calls
 * 
 * Environment Variables:
 * - VITE_API_URL: Full API base URL (e.g., https://domain.com/api)
 * - VITE_API_BASE_URL: Alternative fallback (deprecated, for backward compatibility)
 * 
 * Fallback Chain:
 * - VITE_API_URL → VITE_API_BASE_URL → http://localhost:5001/api
 * 
 * Features:
 * - withCredentials: true - enables automatic cookie sending
 * - Normalized baseURL handling
 */

const getApiBaseUrl = () => {
  // Primary: VITE_API_URL (direct API URL)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.trim().replace(/\/+$/, "");
  }

  // Secondary: VITE_API_BASE_URL (base URL, auto-append /api)
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
  const normalized = baseUrl.trim().replace(/\/+$/, "");

  // Only append /api if not already present
  return /\/api$/i.test(normalized) ? normalized : `${normalized}/api`;
};

export const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // Critical for sending cookies in cross-origin requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add response interceptor for token refresh or error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized typically means token expired or missing
    if (error.response?.status === 401) {
      console.warn("Unauthorized: Check if cookies are being sent with credentials");
    }
    return Promise.reject(error);
  }
);
