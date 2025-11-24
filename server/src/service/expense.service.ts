import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Expense, ExpenseDocument } from "../schemas/expense.schema";
import { AccountService } from "./account.service";

@Injectable()
export class ExpenseService {
    constructor(
        @InjectModel(Expense.name) private readonly expenseDocument: Model<ExpenseDocument>,
        @Inject(forwardRef(() => AccountService))
        private readonly accountService: AccountService,
    ) { }
    async getAllExpense() {
        return this.expenseDocument.find().exec();
    }
    async getExpenseByUserName(payload: { userName: string }) {
        const { userName } = payload;
        return this.expenseDocument.find({ username: userName }).exec();
    }
    async createExpense(payload: { accountId: string, price: number, isIncome: boolean } & Partial<Expense>) {
        const accountFind = await this.accountService.getAccountById(payload.accountId);
        const account = accountFind?.[0];
        if (!account) {
            throw new Error("Account not found");
        }
        const prevAmount = Number(account.expenseAmount) || 0;
        const currentExpense = Number(payload.price) || 0;

        const payloadForAccount = {
            _id: payload.accountId,
            ...(!payload.isIncome ? { expenseAmount: prevAmount + currentExpense, balance: account?.balance - payload.price }
                :
                { balance: account?.balance + payload.price }),
        };
        await this.accountService.updateAccount(payloadForAccount);
        const created = new this.expenseDocument(payload);
        console.log(created, 'payload')
        return created.save();
    }
}
