import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../schemas/user.schema';
import { CreateUserDto } from '../../dto/createUser.dto';
import { UserInviteLog, UserInviteLogDocument } from 'src/schemas/userInviteLog.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserInviteLog.name) private userInviteLogModel: Model<UserInviteLogDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const isExists = await this.findUserByEmail(createUserDto.email);
    if (isExists) throw new ConflictException('이미 존재하는 이메일입니다');

    const hash = await bcrypt.hash(createUserDto.password, 10);
    const referralCode = await bcrypt.hash(createUserDto.email, 10);

    const createdUser = await this.userModel.create({ ...createUserDto, password: hash, referralCode });

    if (createUserDto.referralCode) {
      const referralUser = await this.findUserByReferralCode(createUserDto.referralCode);

      if (!referralUser) {
        throw new NotFoundException('유효하지 않은 추천 코드입니다');
      }

      await this.userInviteLogModel.create({ userId: createdUser._id, referralUserId: referralUser._id });
    }

    return createdUser;
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async findUserByReferralCode(referralCode: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ referralCode });
    return user;
  }
}
