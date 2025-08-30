import { CreateOptions, Model } from "mongoose";
import { IUser as TDocument } from "../models/User.model";
import { DatabaseRepository } from "./database.repository";
import { BadRequest } from "../../utils/response/error.response";
import { HydratedDocument } from "mongoose";

export class UserRepository extends DatabaseRepository<TDocument> {
    constructor(protected override readonly model:Model<TDocument>){
        super(model)
    }

       async createUser({
        data,
        options,
    }: {
        data: Partial<TDocument>[];
        options?: CreateOptions;
    }): Promise<HydratedDocument<TDocument>> {
    const [user] = await this.create({data, options}) || [];
       if (!user) {
           throw new BadRequest("Fail to create this user")
       }
       return user;
    }
}