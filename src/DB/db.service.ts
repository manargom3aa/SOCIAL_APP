import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

interface FindOptions<T> {
  model: Model<T>;
  filter?: FilterQuery<T>;
  select?: string;
  populate?: any[];
}

interface CreateOptions<T> {
  model: Model<T>;
  data: Partial<T> | Partial<T>[];
  options?: object;
}

interface UpdateOptions<T> {
  model: Model<T>;
  filter?: FilterQuery<T>;
  data: UpdateQuery<T>;
  options?: object;
}

interface DeleteOptions<T> {
  model: Model<T>;
  filter?: FilterQuery<T>;
}

export const findOne = async <T extends Document>({
  model,
  filter = {},
  select = "",
  populate = [],
}: FindOptions<T>): Promise<T | null> => {
  return await model.findOne(filter).select(select).populate(populate);
};

export const findById = async <T extends Document>({
  model,
  id,
  select = "",
  populate = [],
}: { model: Model<T>; id: string; select?: string; populate?: any[] }): Promise<T | null> => {
  return await model.findById(id).select(select).populate(populate);
};

export const create = async <T extends Document>({
  model,
  data,
  options = { validateBeforeSave: true },
}: CreateOptions<T>): Promise<T[]> => {
  return await model.create(data, options);
};

export const updateOne = async <T extends Document>({
  model,
  filter = {},
  data,
  options = { runValidators: true },
}: UpdateOptions<T>): Promise<any> => {
  return await model.updateOne(filter, data, options);
};

export const deleteOne = async <T extends Document>({
  model,
  filter = {},
}: DeleteOptions<T>): Promise<any> => {
  return await model.deleteOne(filter);
};
