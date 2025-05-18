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
    try {
      const isExists = await this.findUserByEmail(createUserDto.email);
      if (isExists) throw new ConflictException('email exists');

      const hash = await bcrypt.hash(createUserDto.password, 10);
      const referralCode = await bcrypt.hash(createUserDto.email, 10);

      const createdUser = await this.userModel.create({ ...createUserDto, password: hash, referralCode });

      if (createUserDto.referralCode) {
        const referralUser = await this.findUserByReferralCode(createUserDto.referralCode);

        if (!referralUser) {
          throw new NotFoundException('Invalid referral code');
        }

        await this.userInviteLogModel.create({ userId: createdUser._id, referralUserId: referralUser._id });
      }

      return createdUser;
    } catch (error) {
      throw error;
    }
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
