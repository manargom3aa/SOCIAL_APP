"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const validators = __importStar(require("./auth.validation"));
const response_1 = require("../../utils/response");
const hash_security_1 = require("../../utils/security/hash.security");
const email_event_1 = require("../../utils/events/email.event");
const nanoid_1 = require("nanoid");
const User_model_1 = require("../../DB/models/User.model");
const otpGenerator = (0, nanoid_1.customAlphabet)("0123456789", 6);
class AuthenticationService {
    signup = (0, response_1.asyncHandler)(async (req, res) => {
        validators.signup.body.parse(req.body);
        const { fullName, email, password } = req.body;
        const existingUser = await User_model_1.UserModel.findOne({ email });
        if (existingUser)
            return res.status(409).json({ message: "Email already exists" });
        const hashPassword = await (0, hash_security_1.generateHash)({ plaintext: password });
        const otp = otpGenerator();
        const hashedOtp = await (0, hash_security_1.generateHash)({ plaintext: otp });
        const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
        const user = await User_model_1.UserModel.create({
            fullName,
            email,
            password: hashPassword,
            otp: hashedOtp,
            otpExpires: otpExpiresAt,
            isConfirmed: false,
        });
        email_event_1.emailEvent.emit("confirmEmail", { to: email, otp });
        console.log("✅ Signup OTP:", otp);
        return (0, response_1.successResponse)({
            res,
            status: 201,
            message: "User created. OTP sent to email",
            data: { email: user.email, fullName: user.fullName },
        });
    });
    confirmEmail = (0, response_1.asyncHandler)(async (req, res) => {
        validators.confirmEmail.body.parse(req.body);
        const { email, otp } = req.body;
        const user = await User_model_1.UserModel.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (user.isConfirmed)
            return res.status(400).json({ message: "Email already confirmed" });
        const now = new Date();
        if (!user.otp || !user.otpExpires || user.otpExpires < now) {
            const newOtp = otpGenerator();
            user.otp = await (0, hash_security_1.generateHash)({ plaintext: newOtp });
            user.otpExpires = new Date(Date.now() + 2 * 60 * 1000);
            await user.save();
            email_event_1.emailEvent.emit("confirmEmail", { to: email, otp: newOtp });
            console.log("✅ OTP expired, new OTP sent:", newOtp);
            return res.status(400).json({ message: "OTP expired. A new OTP has been sent to your email." });
        }
        const isValidOtp = await (0, hash_security_1.compareHash)({ plaintext: otp, hashValue: user.otp });
        if (!isValidOtp)
            return res.status(400).json({ message: "Invalid OTP" });
        user.isConfirmed = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return (0, response_1.successResponse)({ res, message: "Email confirmed successfully" });
    });
    login = (0, response_1.asyncHandler)(async (req, res) => {
        validators.login.body.parse(req.body);
        const { email, password } = req.body;
        const user = await User_model_1.UserModel.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (!user.isConfirmed)
            return res.status(400).json({ message: "Email not confirmed yet" });
        const isValidPassword = await (0, hash_security_1.compareHash)({ plaintext: password, hashValue: user.password });
        if (!isValidPassword)
            return res.status(400).json({ message: "Invalid password" });
        return (0, response_1.successResponse)({
            res,
            message: "Login successful",
            data: { email: user.email, fullName: user.fullName },
        });
    });
}
exports.default = new AuthenticationService();
