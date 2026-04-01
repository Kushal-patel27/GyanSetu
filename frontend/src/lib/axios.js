import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: configuredApiUrl?.trim() || "/api",
  withCredentials: true,
});
