import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../schemas/account.schemas';

@Injectable()
export class AccountService {
    constructor(
        @InjectModel(Account.name) private readonly accountModel: Model<AccountDocument>,
    ) { }

    async getAllAccounts() {
        return this.accountModel.find().exec();
    }

    async getAccountByUserName(payload: { userName: string }) {
        const { userName } = payload;
        return this.accountModel.find({ username: userName }).exec();
    }

    async getAccountByUsernameParam(username: string) {
        return this.accountModel.find({ username, isDeleted: false }).exec();
    }

    async getAccountById(_id: string) {
        return this.accountModel.find({ _id }).exec();
    }

    async updateAccount(payload: { _id: string } & Partial<Account>) {
        if (!payload._id) {
            throw new Error("Account _id is required for update.");
        }
        const { _id, ...updateData } = payload;
        return this.accountModel.findByIdAndUpdate(
            _id,
            updateData,
            { new: true } // return updated document
        ).exec();
    }

    async createAccount(payload: Partial<Account>) {
        const created = new this.accountModel(payload);
        return created.save();
    }
}