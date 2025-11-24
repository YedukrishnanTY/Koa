import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import bcrypt from "node_modules/bcryptjs";
import { Auth, AuthDocument } from "../schemas/auth.schemas";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Auth.name) private readonly AuthModel: Model<AuthDocument>,
    ) { }
    async createUser(userData: { name: string; password: string; currency: string }) {
        const { name, password, currency } = userData;
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const newUser = new this.AuthModel({ name, password: hashed, role: [], currency });
        const saved = await newUser.save();
        return saved;
    }
    async findUserByUserName(name: string) {
        return this.AuthModel.findOne({ name }).exec();
    }

    async loginUser(name: string, password: string) {
        const user = await this.AuthModel.findOne({ name }).exec();
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
