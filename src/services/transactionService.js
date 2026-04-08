import api from "../lib/axios";
import { getUserId } from "./authService";

export const getBalance = async (accountId) => {
  const userId = accountId ?? getUserId();
  if (!userId) {
    throw new Error("Account ID not found in JWT or arguments");
  }

  const res = await api.get(`/account/balance/${userId}`);
  return res.data.data;
};
