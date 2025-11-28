import api from "../lib/axios";

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};
