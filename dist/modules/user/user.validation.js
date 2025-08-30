"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const zod_1 = __importDefault(require("zod"));
const token_security_1 = require("../../utils/security/token.security");
exports.logout = {
    body: zod_1.default.strictObject({
        flag: zod_1.default.enum(token_security_1.LogoutEnum).default(token_security_1.LogoutEnum.only)
    })
};
