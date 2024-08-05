import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<User | UnauthorizedException> {
    const user = await this.usersService.findOne(email);

    if (user.password !== password) return new UnauthorizedException();

    delete user.password;

    return user;
  }
}
