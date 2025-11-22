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
    HttpException,
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
        const existing = await this.userService.findUserByUserName(User.name);
        if (existing) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Email already in use',
                },
                HttpStatus.BAD_REQUEST
            );
        }
        if (!User.currency) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Please select a currency',
                },
                HttpStatus.BAD_REQUEST
            );
        }
        const user = await this.userService.createUser(User);
        const { password, ...safe } = user.toObject ? user.toObject() : user;
        return safe;
    }

    // GET /users/:name
    @Get('/:name')
    @HttpCode(HttpStatus.OK)
    async findByEmail(@Param('name') name: string) {
        const user = await this.userService.findUserByUserName(name);
        if (!user) throw new NotFoundException('User not found');
        const { password, ...safe } = user.toObject ? user.toObject() : user;
        return safe;
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: { name: string; password: string }) {
        const { name, password } = body;
        const user = await this.userService.loginUser(name, password);
        if (!user) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Invalid credentials',
                },
                HttpStatus.UNAUTHORIZED
            );
        }
        const { password: pwd, ...safe } = user.toObject ? user.toObject() : user;
        return safe;
    }

}
