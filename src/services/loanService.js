import api from "../lib/axios";
import { getUserId } from "./authService";

export const getLoanApplicationByUserId = async (accountId) => {
  const userId = accountId ?? getUserId();
  if (!userId) {
    throw new Error("Account ID not found in JWT or arguments");
  }

  const res = await api.get(`/loan-applications/${userId}`);
  return res.data;
};


export const applyLoanApplication = async (applicationData) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error("User ID not found");
  }

  const payload = {
    userId,
    ...applicationData,
  };

  const res = await api.post("/loan-applications", payload);
  return res.data;
};
