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
import { Role, User } from 'src/users/entities/user.entity';
import { RoleGuard } from '../decorators/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.getIsPublic(context)) return true;

    const request = context.switchToHttp().getRequest();

    const token = this.grabTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    let payload: User;

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('APP_SECRET'),
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    const userRole = payload.role;
    if (userRole === Role.ADMIN) return true;

    if (this.getRouteRole(context) === Role.ADMIN) return false;

    return true;
  }

  private getRouteRole(context: ExecutionContext): Role {
    return this.reflector.get(RoleGuard, context.getHandler());
  }

  private getIsPublic(context: ExecutionContext): boolean {
    const roleOrPublic = this.reflector.getAllAndOverride<boolean>(
      authConstants.IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    return roleOrPublic;
  }

  private grabTokenFromHeader(request: Request): string | null {
    const headers = request.headers;

    if (!headers['authorization']) return null;

    const [type, token] = headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
