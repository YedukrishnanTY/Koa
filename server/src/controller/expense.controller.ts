import {
    Body,
    Controller,
    Get, Headers,
    HttpCode,
    HttpException,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ExpenseService } from '../service/expense.service';
import { TokenService } from '../service/token.services';

@Controller('expense')
export class ExpenseController {
    constructor(private readonly ExpenseService: ExpenseService,
        private readonly tokenService: TokenService) { }

    // GET /expense
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllExpenses() {
        const Expenses = await this.ExpenseService.getAllExpense();
        return Expenses;
    }


    // GET /expense/all
    @UseGuards(AuthGuard('jwt'))
    @Get('/all')
    @HttpCode(HttpStatus.OK)
    async getExpensePerUser(@Headers() headers: Record<string, any>) {
        const username = this.tokenService.getUsernameFromHeaders(headers);
        const payload = {
            userName: username
        }
        const Expenses = await this.ExpenseService.getExpenseByUserName(payload);
        return Expenses || [];
    }

    // GET /expense/all
    @UseGuards(AuthGuard('jwt'))
    @Get('/Create')
    @HttpCode(HttpStatus.OK)
    async createExpense(@Headers() headers: Record<string, any>, @Body() body: Record<string, any>) {
        const username = this.tokenService.getUsernameFromHeaders(headers);
        const expensePayload = { ...body, username };
        const created = await this.ExpenseService.createExpense(expensePayload);
        return created;
    }



}
