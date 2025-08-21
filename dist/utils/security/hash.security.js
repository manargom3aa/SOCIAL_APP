"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.generateHash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateHash = async ({ plaintext }) => {
    const salt = await bcrypt_1.default.genSalt(10);
    return await bcrypt_1.default.hash(plaintext, salt);
};
exports.generateHash = generateHash;
const compareHash = async ({ plaintext, hashValue }) => {
    if (!plaintext || !hashValue)
        throw new Error("data and hash arguments required");
    return await bcrypt_1.default.compare(plaintext, hashValue);
};
exports.compareHash = compareHash;
