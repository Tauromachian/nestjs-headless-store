import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Response } from 'express';
import { compare } from 'bcrypt';

import { UsersService } from '@/users/users.service';
import { Payload } from './types/payload.type';
import { AuthReturn } from './types/auth-return.type';
import { SessionService } from '@/sessions/session.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
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

  async login(
    email: string,
    password: string,
    res: Response,
  ): Promise<AuthReturn> {
    let user: User;

    try {
      user = await this.usersRepository.findOne({
        where: { email },
        select: ['id', 'role', 'email', 'password'],
      });
    } catch {
      throw new UnauthorizedException();
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
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
      console.warn(error);

      throw new UnauthorizedException();
    }
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

    return tokenObject;
  }
}
