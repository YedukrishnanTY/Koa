import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    NotFoundException,
    HttpCode,
    HttpStatus,
    HttpException,
    Headers,
    UseGuards
} from '@nestjs/common';
import { AuthService } from 'src/service/auth.service';
import { Auth } from "src/schemas/auth.schemas";
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('users')
export class AuthController {
    constructor(private readonly AuthService: AuthService,
        private jwtService: JwtService) { }

    // POST /users/register
    @Post('/register')
    async create(@Body() User: Auth) {
        // check existing
        const existing = await this.AuthService.findUserByUserName(User.name);
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
        const user = await this.AuthService.createUser(User);
        const { password, ...safe } = user.toObject ? user.toObject() : user;
        return safe;
    }

    // GET /users/get-profile-details

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get('/get-profile-details')
    @HttpCode(HttpStatus.OK)
    async findByEmail(@Headers() headers: Record<string, any>,) {
        const authorizationHeader = headers['authorization'];
        const token = authorizationHeader?.split(' ')[1];
        if (!token) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'No token provided',
                },
                HttpStatus.UNAUTHORIZED
            );
        }
        const decoded = this.jwtService.verify(token);
        if (!decoded || !decoded.name) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Invalid token',
                },
                HttpStatus.UNAUTHORIZED
            );
        }

        const user = await this.AuthService.findUserByUserName(decoded.name);
        if (!user) throw new HttpException({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'username already exists',
        }, HttpStatus.BAD_REQUEST
        );

        const { password, ...safe } = user.toObject ? user.toObject() : user;
        return safe;
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: { name: string; password: string },) {
        const { name, password } = body;
        const user = await this.AuthService.loginUser(name, password);
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
        const payload = {
            sub: user._id,
            name: user.name,
            role: Array.isArray(user.role) ? user.role.map(r => String(r).toUpperCase()) : [],
        };
        const token = this.jwtService.sign(payload);


        return {
            user: safe,
            token,
        };
    }

}
