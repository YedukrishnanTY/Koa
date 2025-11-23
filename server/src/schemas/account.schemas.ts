import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
    @Prop({ required: true })
    accountId: string;

    @Prop({ required: true })
    accountName: string;

    @Prop({ required: true, default: 0 })
    balance: number;

    @Prop({ required: true, default: 'USD' })
    currency: string;

    @Prop({ required: true })
    username: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);