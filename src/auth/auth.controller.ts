import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from './decorators/public.decorator';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  login(
    @Body() signInDto: Record<string, string>,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(signInDto.email, signInDto.password, res);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('register')
  register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(createUserDto, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @Public()
  refresh(@Req() req: Request) {
    const refreshToken = req.cookies['refreshToken'];

    return this.authService.refreshToken(refreshToken);
  }
}
