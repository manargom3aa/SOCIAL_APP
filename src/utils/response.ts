import { Request, Response, NextFunction } from "express";

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  fn(req, res, next).catch((error: any) => next(error));

export const successResponse = ({ res, message = "Done", status = 200, data = {} } : { res: Response; message?: string; status?: number; data?: any }) => {
  return res.status(status).json({ message, data });
};
