import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Expense, ExpenseDocument } from "src/schemas/expense.schema";

@Injectable()
export class ExpenseService {
    constructor(
        @InjectModel(Expense.name) private readonly expenseDocument: Model<ExpenseDocument>,
    ) { }
    async getAllExpense() {
        return this.expenseDocument.find().exec();
    }
    async getExpenseByUserName(payload: { userName: string }) {
        const { userName } = payload;
        return this.expenseDocument.find({ username: userName }).exec();
    }
    async createExpense(payload: Partial<Expense>) {
        const created = new this.expenseDocument(payload);
        return created.save();
    }
}
