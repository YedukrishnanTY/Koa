import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { User, UserSchema } from './schemas/user.schemas';
import { ConfigModule } from '@nestjs/config';

require('dotenv').config();

const uri = process.env.DATABASE_URL || '';

@Module({
  imports: [
    MongooseModule.forRoot(uri),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [UsersController],
  providers: [UserService],
})
export class AppModule { }
