import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[0-9]{10,15}$/, "Invalid phone number format (e.g. +628123456789)")
});
