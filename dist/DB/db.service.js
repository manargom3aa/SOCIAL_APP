"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.findById = void 0;
const findById = async ({ model, id, select = "", populate = [], }) => {
    return await model.findById(id).select(select).populate(populate);
};
exports.findById = findById;
const deleteOne = async ({ model, filter = {}, }) => {
    return await model.deleteOne(filter);
};
exports.deleteOne = deleteOne;
