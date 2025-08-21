import { z } from "zod";

export const signup = {
  body: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    phone: z.string().min(10),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
};

export const confirmEmail = {
  body: z.object({
    email: z.string().email(),
    otp: z.string().length(6),
  }),
};

export const login = {
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
};
