import api from "../lib/axios";

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
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
