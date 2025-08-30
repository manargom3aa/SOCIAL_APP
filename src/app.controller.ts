
import { resolve } from "node:path";
import { config } from "dotenv";


config({ path: resolve("./config/.env.development") });

import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userController from "./modules/user/user.controller";
import authController from "./modules/auth/auth.controller";
import { globalErrorHandling } from "./utils/response/error.response";
import connectDB from "./DB/connection.db";   



const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ساعة واحدة
  max: 2000,                // أقصى عدد طلبات
  message: { error: "Too many requests, please try again later" },
  statusCode: 429,
});

const bootstrap = async (): Promise<void> => {
  const app: Express = express();
  const port: number | string = process.env.PORT || 5000;

  // ------------------------------------
  app.use(cors());
  app.use(express.json());
  app.use(helmet());
  app.use(limiter);

  // ------------------ Connect DB ------------------
  await connectDB();




  // ------------------ Routes ------------------
  app.get("/", (req: Request, res: Response) => {
    res.json({
      message: `Welcome to ${process.env.APPLICATION_NAME} backend landing page 🚀`,
    });
  });

  //-------------------modules--------------------
  app.use("/auth", authController);
  app.use("/user", userController);


  app.use(globalErrorHandling);

  // In-valid routing
  app.use("{/*dummy}", (req: Request, res: Response) => {
    return res.status(404).json({ message: "Invalid Routing" });
  });

  // ------------------ Server ------------------
  app.listen(port, () => {
    console.log(`✅ Server is running on port ${port} 🚀`);
  });
};

export default bootstrap;
