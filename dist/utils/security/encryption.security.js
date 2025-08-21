"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptEncryption = exports.generateEncryption = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const generateEncryption = ({ plaintext = "", secretkey = process.env.ENCRYPTION_SECRET } = {}) => {
    if (!secretkey)
        throw new Error("Encryption secret key is not defined");
    return crypto_js_1.default.AES.encrypt(plaintext, secretkey).toString();
};
exports.generateEncryption = generateEncryption;
const decryptEncryption = ({ cipherText = "", secretkey = process.env.ENCRYPTION_SECRET } = {}) => {
    if (!secretkey)
        throw new Error("Encryption secret key is not defined");
    return crypto_js_1.default.AES.decrypt(cipherText, secretkey).toString(crypto_js_1.default.enc.Utf8);
};
exports.decryptEncryption = decryptEncryption;
