import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { Auth, AuthSchema } from './schemas/auth.schemas';
import { ConfigModule } from '@nestjs/config';
import { CurrenciesController } from './controller/currencies.controller';
import { CurrenciesService } from './service/currencies.service';
import { Currencies, CurrenciesSchema } from './schemas/currencies.schemas';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { CategoryController } from './controller/category,controller';
import { CategoryService } from './service/category.service';
import { Category, CategorySchema } from './schemas/category.schemas';
import { RolesGuard } from './roles/roles.guard';
import { Reflector } from '@nestjs/core';

require('dotenv').config();

const uri = process.env.DATABASE_URL || '';

@Module({
  imports: [
    MongooseModule.forRoot(uri),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    MongooseModule.forFeature([{ name: Currencies.name, schema: CurrenciesSchema }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || '',
      signOptions: { expiresIn: '365d' }, // token expiry
    }),
  ],
  controllers: [AuthController, CurrenciesController, CategoryController],
  providers: [AuthService, CurrenciesService, JwtStrategy, CategoryService, RolesGuard, Reflector],
  exports: [AuthService, JwtStrategy],
})
export class AppModule { }
