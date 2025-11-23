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
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { AccountService } from 'src/service/account.service';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService, private jwtService: JwtService) { }

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
        const token = headers?.['authorization']?.split(' ')?.[1];
        if (!token) {
            throw new HttpException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'No token provided' }, HttpStatus.UNAUTHORIZED);
        }
        let decodedToken: any;
        try {
            decodedToken = this.jwtService.verify(token);
        } catch (err) {
            throw new HttpException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid token' }, HttpStatus.UNAUTHORIZED);
        }
        const payload = { userName: decodedToken.name };
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
        const token = headers?.['authorization']?.split(' ')?.[1];
        if (!token) {
            throw new HttpException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'No token provided' }, HttpStatus.UNAUTHORIZED);
        }
        let decodedToken: any;
        try {
            decodedToken = this.jwtService.verify(token);
        } catch (err) {
            throw new HttpException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid token' }, HttpStatus.UNAUTHORIZED);
        }
        const username = decodedToken.name;
        if (!username) {
            throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Username param required' }, HttpStatus.BAD_REQUEST);
        }
        return (await this.accountService.getAccountByUsernameParam(username)) || [];
    }

    // Create account: username from token, other fields from body
    @UseGuards(AuthGuard('jwt'))
    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    async createAccount(@Headers() headers: Record<string, any>, @Body() body: Record<string, any>) {
        const token = headers?.['authorization']?.split(' ')?.[1];
        if (!token) {
            throw new HttpException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'No token provided' }, HttpStatus.UNAUTHORIZED);
        }
        let decodedToken: any;
        try {
            decodedToken = this.jwtService.verify(token);
        } catch (err) {
            throw new HttpException({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid token' }, HttpStatus.UNAUTHORIZED);
        }

        const username = decodedToken.name;
        if (!username) {
            throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Username not found in token' }, HttpStatus.BAD_REQUEST);
        }

        const accountPayload = { ...body, username };
        const created = await this.accountService.createAccount(accountPayload);
        return created;
    }
}