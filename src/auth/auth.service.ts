import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string } | UnauthorizedException> {
    const user = await this.usersService.findOne(email, true);

    if (!(await compare(password, user.password))) {
      return new UnauthorizedException();
    }

    const payload = { id: user.id, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string } | UnauthorizedException> {
    const user = await this.usersService.create(createUserDto);

    const tokenObject = await this.login(user.email, createUserDto.password);

    return tokenObject;
  }
}
