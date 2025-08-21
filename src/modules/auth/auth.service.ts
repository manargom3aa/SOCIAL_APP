import type { Request, Response } from "express";
import { ISignupBodyInputsDTto } from "./dto/auth.dto";
import * as validators from "./auth.validation";

import { asyncHandler, successResponse } from "../../utils/response";
import { generateHash, compareHash } from "../../utils/security/hash.security";
import { emailEvent } from "../../utils/events/email.event";
import { customAlphabet } from "nanoid";
import { UserModel } from "../../DB/models/User.model";

 
const otpGenerator = customAlphabet("0123456789", 6);

class AuthenticationService {

  // ------------------ SIGNUP ------------------
  signup = asyncHandler(async (req: Request, res: Response) => {
    validators.signup.body.parse(req.body);
    const { fullName, email, password }: ISignupBodyInputsDTto = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email already exists" });

    const hashPassword = await generateHash({ plaintext: password });

    // توليد OTP
    const otp = otpGenerator();
    const hashedOtp = await generateHash({ plaintext: otp });
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 دقائق

    const user = await UserModel.create({
      fullName,
      email,
      password: hashPassword,
      otp: hashedOtp,
      otpExpires: otpExpiresAt,
      isConfirmed: false,
    });

    emailEvent.emit("confirmEmail", { to: email, otp });
    console.log("✅ Signup OTP:", otp);

    return successResponse({
      res,
      status: 201,
      message: "User created. OTP sent to email",
      data: { email: user.email, fullName: user.fullName },
    });
  });

  // ------------------ CONFIRM EMAIL ------------------
  confirmEmail = asyncHandler(async (req: Request, res: Response) => {
    validators.confirmEmail.body.parse(req.body);
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isConfirmed) return res.status(400).json({ message: "Email already confirmed" });

    const now = new Date();

  
    if (!user.otp || !user.otpExpires || user.otpExpires < now) {
      const newOtp = otpGenerator();
      user.otp = await generateHash({ plaintext: newOtp });
      user.otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 5 دقائق
      await user.save();

      emailEvent.emit("confirmEmail", { to: email, otp: newOtp });
      console.log("✅ OTP expired, new OTP sent:", newOtp);

      return res.status(400).json({ message: "OTP expired. A new OTP has been sent to your email." });
    }

    const isValidOtp = await compareHash({ plaintext: otp, hashValue: user.otp });
    if (!isValidOtp) return res.status(400).json({ message: "Invalid OTP" });

   
    user.isConfirmed = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return successResponse({ res, message: "Email confirmed successfully" });
  });

  // ------------------ LOGIN ------------------
  login = asyncHandler(async (req: Request, res: Response) => {
    validators.login.body.parse(req.body);
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isConfirmed) return res.status(400).json({ message: "Email not confirmed yet" });

    const isValidPassword = await compareHash({ plaintext: password, hashValue: user.password });
    if (!isValidPassword) return res.status(400).json({ message: "Invalid password" });

    return successResponse({
      res,
      message: "Login successful",
      data: { email: user.email, fullName: user.fullName },
    });
  });

}

export default new AuthenticationService();
