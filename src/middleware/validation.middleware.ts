import type { NextFunction, Request, Response } from "express";
import z, { ZodError, ZodType } from "zod";
import { BadRequest } from "../utils/response/error.response";

type KeyReqType = keyof Request;
type SchemaType = Partial<Record<KeyReqType, ZodType>>;

type ValidationErrorsType = Array<{
  key: KeyReqType;
  issues: Array<{
    message: string;
    path: string | number | symbol | undefined;
  }>;
}>;

/*
  // input 
  @param schema : SchemaType


  //output
  if no errors then return next() otherwise throw BadRequest ( validationErrors)
*/

export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validationErrors: ValidationErrorsType = [];

    for (const key of Object.keys(schema) as KeyReqType[]) {
      if (!schema[key]) continue;

      const validationResult = schema[key]!.safeParse(req[key]);

      if (!validationResult.success) {
        const errors = validationResult.error as ZodError;
        validationErrors.push({
          key,
          issues: errors.issues.map((issue) => {
            return { message: issue.message, path: issue.path[0] };
          }),
        });
      }
    }

    if (validationErrors.length) {
      throw new BadRequest("Validation Error", {
        validationErrors,
      });
    }

    next();
  };
};


export const generalFields = {
  username: z.string().min(2).max(20),
  email: z.string().email({
    message: "Valid email must be like example@domain.com",
  }),
  password: z
    .string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must be at least 8 characters, include uppercase, lowercase, and a number"
    ),
  confirmPassword: z.string(),
 otp: z
    .string()
    .length(6)
    .regex(/^[0-9]{6}$/, "OTP must contain only numbers"),

};