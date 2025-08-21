"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const uri = process.env.DB_URI;
        if (!uri) {
            throw new Error("DB_URI is not defined in environment variables");
        }
        const result = await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 3000,
        });
        console.log(result.models);
        console.log("DB connected ✅");
    }
    catch (error) {
        console.error("Fail to connect on DB❌ ", error.message);
    }
};
exports.default = connectDB;
