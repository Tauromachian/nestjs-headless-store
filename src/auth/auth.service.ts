import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { UsersService } from 'src/users/users.service';
import { MailerService } from 'src/mailer/mailer.service';
import { successRegisterEmailConstants } from './constants';
import { Role } from 'src/users/entities/user.entity';

type AuthReturn = {
  accessToken: string;
  refreshToken: string;
};

type Payload = {
  id: string;
  role: Role;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async generateTokens(payload: Payload): Promise<AuthReturn> {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('APP_SECRET'),
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('APP_REFRESH_SECRET'),
      }),
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthReturn> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('APP_REFRESH_SECRET'),
      });

      delete payload.exp;
      delete payload.iat;

      return await this.generateTokens(payload);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async login(email: string, password: string): Promise<AuthReturn> {
    const user = await this.usersService.findOne(email, true);

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, role: user.role };

    return await this.generateTokens(payload);
  }

  async register(createUserDto: CreateUserDto): Promise<AuthReturn> {
    const user = await this.usersService.create(createUserDto);

    const tokenObject = await this.login(user.email, createUserDto.password);

    this.mailerService.sendMail({
      subject: successRegisterEmailConstants.SUBJECT,
      body: successRegisterEmailConstants.BODY,
      to: user.email,
      from: this.configService.get<string>('APP_EMAIL'),
    });

    return tokenObject;
  }
}
