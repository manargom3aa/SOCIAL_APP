"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const connectDB = async () => {
    try {
        const result = await (0, mongoose_1.connect)(process.env.DB_URI, {
            serverSelectionTimeoutMS: 3000,
        });
        console.log(result.models);
        console.log("DB connected ✅");
    }
    catch (error) {
        console.error("Fail to connect on DB❌ ");
    }
};
exports.default = connectDB;
