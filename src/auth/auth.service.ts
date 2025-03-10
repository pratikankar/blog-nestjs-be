import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private usersService: UsersService) {}

    async validateOAuthLogin(profile: any, provider: string): Promise<string> {
        const user = await this.usersService.findOrCreateOAuthUser(profile, provider);
        return this.jwtService.sign({ sub: user.id, email: user.email });
    }
}