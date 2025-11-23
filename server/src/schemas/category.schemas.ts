import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type categoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {

    @Prop({ unique: true,required: true })
    code: string;

    @Prop({ required: true, })
    name: string;

    @Prop({ required: true })
    icon: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: false })
    isDisabled: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);