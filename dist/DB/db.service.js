"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.updateOne = exports.create = exports.findById = exports.findOne = void 0;
const findOne = async ({ model, filter = {}, select = "", populate = [], }) => {
    return await model.findOne(filter).select(select).populate(populate);
};
exports.findOne = findOne;
const findById = async ({ model, id, select = "", populate = [], }) => {
    return await model.findById(id).select(select).populate(populate);
};
exports.findById = findById;
const create = async ({ model, data, options = { validateBeforeSave: true }, }) => {
    return await model.create(data, options);
};
exports.create = create;
const updateOne = async ({ model, filter = {}, data, options = { runValidators: true }, }) => {
    return await model.updateOne(filter, data, options);
};
exports.updateOne = updateOne;
const deleteOne = async ({ model, filter = {}, }) => {
    return await model.deleteOne(filter);
};
exports.deleteOne = deleteOne;
