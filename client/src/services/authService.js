import { getApiErrorMessage, throwApiError } from "../utils/apiError";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export const registerUser = async ({ name, email, password }) => {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      await throwApiError(response, "Unable to create account. Please try again.");
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid API response");
    }

    return result.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to create account. Please try again."));
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      await throwApiError(response, "Unable to log in. Please try again.");
    }

    const result = await response.json();

    if (!result.success || !result.token || !result.data) {
      throw new Error("Invalid API response");
    }

    return { token: result.token, user: result.data };
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to log in. Please try again."));
  }
};

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const saveAuthSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_KEY);

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return Boolean(getStoredToken());
};

export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
