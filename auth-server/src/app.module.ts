import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Ping, PingSchema } from './schemas/ping.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User, UserSchema } from './schemas/user.schema';
import { AuthController } from './auth.controller';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),

    MongooseModule.forRoot(process.env.MONGO_URI, {}),
    MongooseModule.forFeature([
      { name: Ping.name, schema: PingSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, AuthService, UsersService],
})
export class AppModule {}

/*
유저 정보 관리, 로그인, 역할 관리, JWT 발급
유저 등록 / 로그인 / 역할(role) 관리
JWT 관리
예시 역할:
역할권한 설명
USER 보상 요청 가능
OPERATOR 이벤트/보상 등록
AUDITOR 보상 이력조회만 가능
ADMIN 모든 기능 접근 가능



Gateway Server
모든 API 요청의 진입점, 인증, 권한 검사 및 라우팅
모든 요청을 받아 라우팅 수행
JWT 토큰 검증 및 역할(Role) 검사
NestJS의 @nestjs/passport , AuthGuard , RolesGuard 사용
*/
