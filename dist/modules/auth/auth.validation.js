"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.confirmEmail = exports.signup = void 0;
const zod_1 = require("zod");
exports.signup = {
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(2),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
        confirmPassword: zod_1.z.string(),
        phone: zod_1.z.string().min(10),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
};
exports.confirmEmail = {
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        otp: zod_1.z.string().length(6),
    }),
};
exports.login = {
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    }),
};
