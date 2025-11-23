import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category, categoryDocument } from "src/schemas/category.schemas";

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private readonly userModel: Model<categoryDocument>) { }

    async getAllCategories() {
        return this.userModel.find().exec();
    }
    async createCategory(catgoryData: { name: string, icon: string, createdAt: number, updatedAt: number, isDisabled: boolean }) {
        const newCategory = new this.userModel(catgoryData);
        return newCategory.save();
    }

    async disableCategory(categoryId: string) {
        return this.userModel.findByIdAndUpdate(categoryId, { isDisabled: true }, { new: true }).exec();
    }

    async createCategoryList(categories: Array<{ name: string, icon: string }>) {
        const timestamp = new Date().getTime();
        const categoryData = categories.map(category => ({
            ...category,
            createdAt: timestamp,
            updatedAt: timestamp,
            isDisabled: false,
            code: category.name.toLowerCase().replace(/\s+/g, '-'),
        }));
        return this.userModel.insertMany(categoryData);
    }
}