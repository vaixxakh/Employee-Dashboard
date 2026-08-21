import { getStoredToken, logoutUser } from "./authService";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export const apiFetch = async (url, options = {}) => {
  const token = getStoredToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    logoutUser();
    window.dispatchEvent(new Event("auth:expired"));
  }

  return response;
};
