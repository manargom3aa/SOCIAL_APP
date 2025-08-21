"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = exports.validation = void 0;
const zod_1 = __importDefault(require("zod"));
const error_response_1 = require("../utils/response/error.response");
const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const validationResult = schema[key].safeParse(req[key]);
            if (!validationResult.success) {
                const errors = validationResult.error;
                validationErrors.push({
                    key,
                    issues: errors.issues.map((issue) => {
                        return { message: issue.message, path: issue.path[0] };
                    }),
                });
            }
        }
        if (validationErrors.length) {
            throw new error_response_1.BadRequest("Validation Error", {
                validationErrors,
            });
        }
        next();
    };
};
exports.validation = validation;
exports.generalFields = {
    username: zod_1.default.string().min(2).max(20),
    email: zod_1.default.string().email({
        message: "Valid email must be like example@domain.com",
    }),
    password: zod_1.default
        .string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Password must be at least 8 characters, include uppercase, lowercase, and a number"),
    confirmPassword: zod_1.default.string(),
    otp: zod_1.default
        .string()
        .length(6)
        .regex(/^[0-9]{6}$/, "OTP must contain only numbers"),
};
