"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../../utils/response");
const hash_security_1 = require("../../utils/security/hash.security");
const User_model_1 = require("../../DB/models/User.model");
const user_repository_1 = require("../../DB/repository/user.repository");
const error_response_1 = require("../../utils/response/error.response");
const email_event_1 = require("../../utils/events/email.event");
const otp_1 = require("../../utils/otp");
const token_security_1 = require("../../utils/security/token.security");
const google_auth_library_1 = require("google-auth-library");
class AuthenticationService {
    userModel = new user_repository_1.UserRepository(User_model_1.UserModel);
    constructor() {
    }
    async verifyGmailAccount(idToken) {
        const client = new google_auth_library_1.OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.WEB_CLIENT_ID?.split(",") || [],
        });
        const payload = ticket.getPayload();
        if (!payload?.email_verified) {
            throw new error_response_1.BadRequest("Fail to verify this google account");
        }
        return payload;
    }
    signupWithGmail = async (req, res) => {
        const { idToken } = req.body;
        const { email, family_name, given_name, picture } = await this.verifyGmailAccount(idToken);
        const user = await this.userModel.findOne({
            filter: {
                email,
            },
        });
        if (user) {
            if (user.provider === User_model_1.ProviderEnum.GOOGLE) {
                return await this.loginWithGmail(req, res);
            }
            throw new error_response_1.ConflictException(`Email exist with another provider :::${user.provider}`);
        }
        const [newUser] = await this.userModel.create({
            data: [{ firstName: given_name, lastName: family_name, email: email, profileImage: picture, confirmedAt: new Date(), provider: User_model_1.ProviderEnum.GOOGLE }]
        }) || [];
        if (!newUser) {
            throw new error_response_1.BadRequest("Fail to signup with gmail please try again later");
        }
        const credentials = await (0, token_security_1.createLoginCredentials)(newUser);
        return res.status(201).json({ message: "Done", data: { credentials } });
    };
    loginWithGmail = async (req, res) => {
        const { idToken } = req.body;
        const { email } = await this.verifyGmailAccount(idToken);
        const user = await this.userModel.findOne({
            filter: {
                email,
                provider: User_model_1.ProviderEnum.SYSTEM,
            },
        });
        if (!user) {
            throw new error_response_1.NotFoundException(`Not Register account or registered with another provider`);
        }
        const credentials = await (0, token_security_1.createLoginCredentials)(user);
        return res.status(200).json({ message: "Done", data: { credentials } });
    };
    signup = async (req, res) => {
        let { userName, email, password } = req.body;
        const existingUser = await this.userModel.findOne({
            filter: { email },
            select: "email",
            options: {
                lean: true,
            },
        });
        if (existingUser) {
            throw new error_response_1.ConflictException("Email already exists");
        }
        const otp = (0, otp_1.generateNumberOtp)();
        const user = await this.userModel.createUser({
            data: [{ userName, email, password: await (0, hash_security_1.generateHash)(password), confirmEmailOtp: await (0, hash_security_1.generateHash)(String(otp)) }]
        });
        email_event_1.emailEvent.emit("confirmEmail", { to: email, otp });
        return (0, response_1.successResponse)({
            res,
            status: 201,
            message: "User created. OTP sent to email",
            data: { email: user.email, userName: user.userName },
        });
    };
    confirmEmail = async (req, res) => {
        const { email, otp } = req.body;
        const user = await this.userModel.findOne({
            filter: {
                email,
                confirmEmailOtp: { $exists: true },
                confirmedAt: { $exists: false },
            },
        });
        if (!user)
            throw new error_response_1.NotFoundException("User not found");
        if (!(await (0, hash_security_1.compareHash)(otp, user.confirmEmailOtp))) {
            throw new error_response_1.ConflictException("In-valid confirmation code");
        }
        await this.userModel.updateOne({
            filter: { email },
            update: {
                confirmedAt: new Date(),
                $unset: { confirmEmailOtp: 1 },
            },
        });
        return res.json({ message: "Done" });
    };
    login = async (req, res) => {
        const { email, password } = req.body;
        const user = await this.userModel.findOne({
            filter: { email },
        });
        if (!user) {
            throw new error_response_1.NotFoundException("User not found");
        }
        if (!user.confirmedAt) {
            throw new error_response_1.BadRequest("Please confirm your email first");
        }
        const isPasswordValid = await (0, hash_security_1.compareHash)(password, user.password);
        if (!isPasswordValid) {
            throw new error_response_1.ConflictException("Invalid login credentials");
        }
        const credentials = await (0, token_security_1.createLoginCredentials)(user);
        return res.json({ message: "Done", data: { credentials } });
    };
    sendForgotCode = async (req, res) => {
        const { email } = req.body;
        const user = await this.userModel.findOne({
            filter: { email, provider: User_model_1.ProviderEnum.SYSTEM, confirmedAt: { $exists: true } },
        });
        if (!user) {
            throw new error_response_1.NotFoundException("invalid account");
        }
        const otp = (0, otp_1.generateNumberOtp)();
        const result = await this.userModel.updateOne({
            filter: { email },
            update: {
                resetPasswordOtp: await (0, hash_security_1.generateHash)(String(otp)),
            },
        });
        if (!result.matchedCount) {
            throw new error_response_1.BadRequest("Fail to send the reset code please try again later");
        }
        email_event_1.emailEvent.emit("resetPassword", { to: email, otp });
        return res.json({
            message: "Done"
        });
    };
    verifyForgotPassword = async (req, res) => {
        const { email, otp } = req.body;
        const user = await this.userModel.findOne({
            filter: { email, provider: User_model_1.ProviderEnum.SYSTEM, resetPasswordOtp: { $exists: true } },
        });
        if (!user) {
            throw new error_response_1.NotFoundException("invalid account");
        }
        if (!await (0, hash_security_1.compareHash)(otp, user.resetPasswordOtp)) {
            throw new error_response_1.ConflictException("invalid otp");
        }
        return res.json({
            message: "Done"
        });
    };
    resetForgotPassword = async (req, res) => {
        const { email, otp, password } = req.body;
        const user = await this.userModel.findOne({
            filter: { email, provider: User_model_1.ProviderEnum.SYSTEM, resetPasswordOtp: { $exists: true } },
        });
        if (!user) {
            throw new error_response_1.NotFoundException("invalid account");
        }
        if (!await (0, hash_security_1.compareHash)(otp, user.resetPasswordOtp)) {
            throw new error_response_1.ConflictException("invalid otp");
        }
        const result = await this.userModel.updateOne({
            filter: { email },
            update: {
                password: await (0, hash_security_1.generateHash)(password),
                changeCredentialsTime: new Date(),
                $unset: { resetPasswordOtp: 1 },
            },
        });
        if (!result.matchedCount) {
            throw new error_response_1.BadRequest("Fail to send the reset account password please try again later");
        }
        return res.json({
            message: "Done"
        });
    };
}
exports.default = new AuthenticationService();
