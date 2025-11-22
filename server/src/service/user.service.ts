import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import bcrypt from "node_modules/bcryptjs";
import { User, UserDocument } from "src/schemas/user.schemas";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) { }
    async createUser(userData: { name: string; email: string; password: string; }) {
        const { name, email, password } = userData;
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const newUser = new this.userModel({ name, email, password: hashed });
        const saved = await newUser.save();
        return saved;
    }
    async findUserByEmail(email: string) {
        return this.userModel.findOne({ email }).exec();
    }
}
