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
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { Category, CategorySchema } from './schemas/category.schemas';
import { RolesGuard } from './roles/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExpenseService } from './service/expense.service';
import { ExpenseController } from './controller/expense.controller';
import { Expense, ExpenseSchema } from './schemas/expense.schema';
import { AccountService } from './service/account.service';
import { AccountController } from './controller/account.controller';
import { Account, AccountSchema } from './schemas/account.schemas';
import { TokenService } from './service/token.services';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL || ''),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    MongooseModule.forFeature([{ name: Currencies.name, schema: CurrenciesSchema }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || '',
      signOptions: { expiresIn: '365d' }, // token expiry
    }),
  ],
  controllers: [AuthController, CurrenciesController, CategoryController, ExpenseController, AccountController],
  providers: [AuthService, CurrenciesService, JwtStrategy, CategoryService, RolesGuard, Reflector, ExpenseService, AccountService, TokenService],
  exports: [AuthService, JwtStrategy],
})
export class AppModule { }
