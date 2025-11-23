import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from 'src/schemas/account.schemas';

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
        return this.accountModel.find({ username }).exec();
    }

    async createAccount(payload: Partial<Account>) {
        const created = new this.accountModel(payload);
        return created.save();
    }
}