import api from "../lib/axios";

export const getBalance = async (data) => {
  const res = await api.get("/wallet", data);
  return res.data;
};
