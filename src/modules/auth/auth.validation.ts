import { z } from "zod";
import { generalFields } from "../../middleware/validation.middleware";

export const login = {
  body: z.object({
    email: generalFields.email,
    password: generalFields.password,
  }),
};

export const signup = {
  body: login.body
    .extend({
      userName: generalFields.username,
      confirmPassword: generalFields.confirmPassword,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
};

export const confirmEmail = {
  body: z.strictObject({
    email: generalFields.email,
    otp: generalFields.otp,
  }),
};

export const signupWithGmail = {
  body: z.strictObject({
    idToken: z.string(),
  }),
};

export const sendForgotCode = {
  body: z.strictObject({
    email: generalFields.email,
  }),
};

export const verifyForgotPassword = {
  body: sendForgotCode.body.extend({
    otp: generalFields.otp,
  }),
};

export const resetForgotPassword = {
  body: verifyForgotPassword.body
    .extend({
      password: generalFields.password,
      confirmPassword: generalFields.confirmPassword,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password mismatch confirm-password",
      path: ["confirmPassword"],
    }),
};
