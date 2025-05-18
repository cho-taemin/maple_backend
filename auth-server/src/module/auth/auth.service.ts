// auth-server/src/users/users.service.ts
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { UserAccessLog, UserAccessLogDocument } from 'src/schemas/userAccessLog.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserAccessLog.name) private userAccessLogModel: Model<UserAccessLogDocument>,
    private readonly jwt: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    try {
      const user = await this.usersService.findUserByEmail(loginDto.email);
      if (!user) throw new NotFoundException('user not found');

      const isPasswordMatch = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordMatch) throw new UnauthorizedException('invalid password');

      const payload = { sub: user._id.toString(), email: user.email, username: user.username, roles: user.roles };

      await this.userAccessLogModel.create({ userId: user._id });

      return { access_token: this.jwt.sign(payload) };
    } catch (error) {
      throw error;
    }
  }
}
