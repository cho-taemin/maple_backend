// auth-server/src/users/users.service.ts
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findUserByEmail(loginDto.email);
    if (!user) throw new NotFoundException('user not found');

    const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordMatch) throw new UnauthorizedException('invalid password');

    const payload = { sub: user._id.toString(), email: user.email, username: user.username, roles: user.roles };

    return { access_token: this.jwt.sign(payload) };
  }
}
