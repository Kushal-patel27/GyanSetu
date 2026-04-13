import axios from "axios";

const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
  return apiUrl.trim().replace(/\/+$/, "");
};

export const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
