import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
    @Prop({ required: true })
    accountName: string;

    @Prop({ required: true, default: 0 })
    balance: number;

    @Prop({ required: true, })
    currency: string;

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    icon: string;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ required: false, default: 0 })
    expenseAmount: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account); 