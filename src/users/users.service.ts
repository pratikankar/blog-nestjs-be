import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

    async findOrCreateOAuthUser(profile: any, provider: string): Promise<User> {
        let user = await this.usersRepo.findOne({ where: { email: profile.emails[0].value }});
        if(!user) {
            user = this.usersRepo.create({ email: profile.emails[0].value , provider });
            await this.usersRepo.save(user);
        }
        return user;
    }
}