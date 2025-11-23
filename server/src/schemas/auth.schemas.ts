import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    name: string;

    @Prop({ required: true, minlength: 6 })
    password: string;


    @Prop({ type: [String], default: [] })
    role: string[];

    @Prop({ required: true })
    currency: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
