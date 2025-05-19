import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err) {
      throw new UnauthorizedException('인증 과정에서 오류가 발생했습니다');
    }

    if (!user) {
      if (info instanceof Error) {
        if (info.name === 'TokenExpiredError') {
          throw new UnauthorizedException('인증 토큰이 만료되었습니다');
        } else if (info.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('유효하지 않은 인증 토큰입니다');
        }
      }
      throw new UnauthorizedException('인증 정보가 없거나 유효하지 않습니다');
    }

    return user;
  }
}
