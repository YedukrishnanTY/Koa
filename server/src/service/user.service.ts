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
    async createUser(userData: { name: string; password: string; currency: string }) {
        const { name, password, currency } = userData;
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const newUser = new this.userModel({ name, password: hashed, role: [], currency });
        const saved = await newUser.save();
        return saved;
    }
    async findUserByUserName(name: string) {
        return this.userModel.findOne({ name }).exec();
    }
    async loginUser(name: string, password: string) {
        const user = await this.userModel.findOne({ name }).exec();
        if (!user) {
            return null;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null;
        }
        return user;
    }
}
