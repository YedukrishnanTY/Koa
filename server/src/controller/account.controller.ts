import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpException,
    HttpStatus,
    UseGuards,
    Post,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { AccountService } from 'src/service/account.service';
import { TokenService } from 'src/service/token.services';
import { JwtAuthGuard } from 'src/user/jwt.guard';
import { User } from 'src/user/user.decorator';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService, private jwtService: JwtService,
        private tokenService: TokenService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllAccounts() {
        return this.accountService.getAllAccounts();
    }

    // Get accounts for the token user
    @UseGuards(AuthGuard('jwt'))
    @Get('/all')
    @HttpCode(HttpStatus.OK)
    async getAccountsPerUser(@Headers() headers: Record<string, any>) {
        const username = this.tokenService.getUsernameFromHeaders(headers);
        const payload = { userName: username };
        if (!payload.userName) {
            throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Username not found in token' }, HttpStatus.BAD_REQUEST);
        }
        return (await this.accountService.getAccountByUserName(payload)) || [];
    }

    //  get accounts by username 
    @UseGuards(AuthGuard('jwt'))
    @Get('/user')
    @HttpCode(HttpStatus.OK)
    async getByUsername(@Headers() headers: Record<string, any>) {
        const username = this.tokenService.getUsernameFromHeaders(headers);
        return (await this.accountService.getAccountByUsernameParam(username)) || [];
    }

    // Create account: username from token, other fields from body
    @UseGuards(AuthGuard('jwt'))
    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    async createAccount(@Headers() headers: Record<string, any>, @Body() body: Record<string, any>) {
        const username = this.tokenService.getUsernameFromHeaders(headers);
        const accountPayload = { ...body, username };
        const created = await this.accountService.createAccount(accountPayload);
        return created;
    }

    @UseGuards(AuthGuard('jwt'))
    @UseGuards(JwtAuthGuard)
    @Put('/create')
    @HttpCode(HttpStatus.CREATED)
    async EditAccount(@User() user, @Headers() headers: Record<string, any>, @Body() body: { _id: string } & Record<string, any>) {
        const username = this.tokenService.getUsernameFromHeaders(headers);
        const accountPayload = { username, ...body };
        const fetchValue = await this.accountService.updateAccount(accountPayload);

        if (!fetchValue) {
            throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Account details not found' }, HttpStatus.BAD_REQUEST);
        }
        return fetchValue;
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/create')
    @HttpCode(HttpStatus.CREATED)
    async DeleteAccount(@Headers() headers: Record<string, any>, @Body() body: { _id: string } & Record<string, any>) {
        const username = this.tokenService.getUsernameFromHeaders(headers);
        const accountPayload = { username, ...body, isDeleted: true };
        const fetchValue = await this.accountService.updateAccount(accountPayload);

        if (!fetchValue) {
            throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Account details not found' }, HttpStatus.BAD_REQUEST);
        }
        return fetchValue;
    }
}