import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../roles/roles.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { CategoryService } from "../service/category.service";

@Controller('categories')
export class CategoryController {
    constructor(private readonly CategoryService: CategoryService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('/all')
    getCategories() {
        return this.CategoryService.getAllCategories();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Post('/create')
    createCategory(@Body() categoryData: { name: string, icon: string }) {

        const createDate = new Date();
        let timestamp: number = createDate.getTime();
        const payload = { ...categoryData, createdAt: timestamp, updatedAt: timestamp, isDisabled: false };
        return this.CategoryService.createCategory(payload);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Post('/disable')
    disableCategory(@Body() disableData: { categoryId: string }) {
        return this.CategoryService.disableCategory(disableData.categoryId);
    }


    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Post('/create-list')
    createCategoryList(@Body() categories: Array<{ name: string, icon: string }>) {
        return this.CategoryService.createCategoryList(categories);
    }
}