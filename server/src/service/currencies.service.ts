import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Currencies, UserDocument } from "../schemas/currencies.schemas";

@Injectable()
export class CurrenciesService {
    constructor(
        @InjectModel(Currencies.name) private readonly userModel: Model<UserDocument>,
    ) { }
    async getAllCurrencies() {
        return this.userModel.find().exec();
    }
}
