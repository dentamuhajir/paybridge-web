import api from "../lib/axios";

export const registerUser = async (data) => {
  const res = await api.post("/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/login", data);
  return res.data;
};

const decodeJwtPayload = (token) => {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const getTokenPayload = () => {
  const token = localStorage.getItem("access_token");
  return decodeJwtPayload(token);
};

export const getUserEmail = () => {
  const payload = getTokenPayload();
  return payload?.email || payload?.username || payload?.sub || null;
};

export const logout = () => {
  // Remove tokens
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  // Optional: clear all localStorage
  // localStorage.clear();

  // Redirect to login page
  window.location.href = "/auth/sign-in";
};
