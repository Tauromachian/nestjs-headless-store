import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Response } from 'express';

import { successRegisterEmailConstants } from './constants';

import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { UsersService } from 'src/users/users.service';
import { MailerService } from 'src/mailer/mailer.service';
import { Role } from 'src/users/entities/user.entity';
import { SessionService } from 'src/session/session.service';

type AuthReturn = {
  accessToken: string;
  refreshToken?: string;
};

type Payload = {
  id: string;
  role: Role;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly sessionService: SessionService,
  ) {}

  async generateTokens(payload: Payload): Promise<AuthReturn> {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('APP_SECRET'),
        expiresIn: this.configService.get('APP_JWT_EXPIRATION_TIME'),
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('APP_REFRESH_SECRET'),
        expiresIn: this.configService.get('APP_REFRESH_JWT_EXPIRATION_TIME'),
      }),
    };
  }

  async refreshToken(refreshToken: string, res: Response): Promise<AuthReturn> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('APP_REFRESH_SECRET'),
      });

      const sessions = await this.sessionService.findByUserId(payload.id);

      const foundMatch = sessions.find(
        (session) => session.token === refreshToken,
      );

      if (!foundMatch) throw new Error();

      delete payload.exp;
      delete payload.iat;

      const newTokens = await this.generateTokens(payload);

      this.sessionService.update(foundMatch.id, {
        userId: payload.id,
        token: newTokens.refreshToken,
      });

      res.cookie('refreshToken', newTokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: this.configService.get('APP_ENV') === 'production',
        sameSite: 'strict',
        httpOnly: true,
      });

      return { accessToken: newTokens.accessToken };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async login(
    email: string,
    password: string,
    res: Response,
  ): Promise<AuthReturn> {
    const user = await this.usersService.findOne(email, true);

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, role: user.role };

    const tokens = await this.generateTokens(payload);

    this.sessionService.create({
      userId: user.id,
      token: tokens.refreshToken,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: this.configService.get('APP_ENV') === 'production',
      sameSite: 'strict',
      httpOnly: true,
    });

    return { accessToken: tokens.accessToken };
  }

  async register(
    createUserDto: CreateUserDto,
    res: Response,
  ): Promise<AuthReturn> {
    const user = await this.usersService.create(createUserDto);

    const tokenObject = await this.login(
      user.email,
      createUserDto.password,
      res,
    );

    this.mailerService.sendMail({
      subject: successRegisterEmailConstants.SUBJECT,
      body: successRegisterEmailConstants.BODY,
      to: user.email,
      from: this.configService.get<string>('APP_EMAIL'),
    });

    return tokenObject;
  }
}
