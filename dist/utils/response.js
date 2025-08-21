"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = exports.asyncHandler = void 0;
const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch((error) => next(error));
exports.asyncHandler = asyncHandler;
const successResponse = ({ res, message = "Done", status = 200, data = {} }) => {
    return res.status(status).json({ message, data });
};
exports.successResponse = successResponse;
