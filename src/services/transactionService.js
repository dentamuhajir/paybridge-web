import api from "../lib/axios";

export const getBalance = async (accountId) => {
  const res = await api.get(`/account/balance/${accountId}`);
  return res.data.data;
};
