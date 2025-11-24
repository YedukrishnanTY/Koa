import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema({ timestamps: true })
export class Expense {
    @Prop({ required: true, unique: false })
    categoryId: string;

    @Prop({ required: true, unique: false })
    categoryName: string;

    @Prop({ required: true, unique: false })
    accountId: string;

    @Prop({ required: true, unique: false })
    accountName: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    currency: string;

    @Prop({ default: false })
    isIncome: boolean;

    @Prop({ required: true, unique: false })
    username: string;

    @Prop({ required: false })
    notes: string;
}


export const ExpenseSchema = SchemaFactory.createForClass(Expense);

