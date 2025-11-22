import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    ConflictException,
    NotFoundException,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { UserService } from 'src/service/user.service';
import { User } from "src/schemas/user.schemas";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) { }

    // POST /users
    @Post()
    async create(@Body() User: User) {
        // check existing
        const existing = await this.userService.findUserByEmail(User.email);
        if (existing) {
            throw new ConflictException('Email already in use');
        }
        const user = await this.userService.createUser(User);
        // don't return password in response
        const { password, ...safe } = user.toObject ? user.toObject() : user;
        return safe;
    }

    // GET /users/email/:email
    @Get('email/:email')
    @HttpCode(HttpStatus.OK)
    async findByEmail(@Param('email') email: string) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) throw new NotFoundException('User not found');
        const { password, ...safe } = user.toObject ? user.toObject() : user;
        return safe;
    }

}
