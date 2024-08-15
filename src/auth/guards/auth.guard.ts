import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { authConstants } from '../constants';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      authConstants.IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log(isPublic);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.grabTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('APP_SECRET'),
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private grabTokenFromHeader(request: Request): string | null {
    const headers = request.headers;

    if (!headers['authorization']) return null;

    const [type, token] = headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
