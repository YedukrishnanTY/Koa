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
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { ExpenseService } from 'src/service/expense.service';

@Controller('expense')
export class ExpenseController {
    constructor(private readonly ExpenseService: ExpenseService, private jwtService: JwtService) { }

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
        const token = headers?.['authorization']?.split(' ')?.[1]
        if (!token) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'No token provided',
                },
                HttpStatus.UNAUTHORIZED
            );
        }
        let decodedToken: any;
        try {
            decodedToken = this.jwtService.verify(token);
        } catch (err) {
            throw new HttpException(
                { statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid token' },
                HttpStatus.UNAUTHORIZED,
            );
        }
        const payload = {
            userName: decodedToken.name
        }
        const Expenses = await this.ExpenseService.getExpenseByUserName(payload);
        return Expenses || [];
    }

    // GET /expense/all
    @UseGuards(AuthGuard('jwt'))
    @Get('/Create')
    @HttpCode(HttpStatus.OK)
    async createExpense(@Headers() headers: Record<string, any>, @Body() body: Record<string, any>) {
        const token = headers?.['authorization']?.split(' ')?.[1];
        if (!token) {
            throw new HttpException(
                { statusCode: HttpStatus.UNAUTHORIZED, message: 'No token provided' },
                HttpStatus.UNAUTHORIZED,
            );
        }

        let decodedToken: any;
        try {
            decodedToken = this.jwtService.verify(token);
        } catch (err) {
            throw new HttpException(
                { statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid token' },
                HttpStatus.UNAUTHORIZED,
            );
        }

        const username = decodedToken.name;
        if (!username) {
            throw new HttpException(
                { statusCode: HttpStatus.BAD_REQUEST, message: 'Username not found in token' },
                HttpStatus.BAD_REQUEST,
            );
        }

        const expensePayload = { ...body, username };
        const created = await this.ExpenseService.createExpense(expensePayload);
        return created;
    }



}
