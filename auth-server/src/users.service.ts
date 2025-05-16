// auth-server/src/users/users.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isExists = await this.userModel.findOne({ email: createUserDto.email });
    if (isExists) throw new ConflictException('email exists');
    const hash = await bcrypt.hash(createUserDto.password, 10);
    return this.userModel.create({ ...createUserDto, password: hash });
  }
}
