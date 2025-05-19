import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Reward, RewardDocument } from '../../schema/rewards.schema';
import { CreateRewardDto } from '../../dto/createReward.dto';
import { RewardFilter } from '../../type/interface/reward.filter.interface';
import { GetRewardListDto } from 'src/dto/getRewardList.dto';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async createReward(
    createRewardDto: CreateRewardDto,
  ): Promise<RewardDocument> {
    if (
      createRewardDto.expiryDate &&
      new Date(createRewardDto.expiryDate) < new Date()
    ) {
      throw new BadRequestException('만료일은 현재 이후여야 합니다');
    }

    const createdReward = await this.rewardModel.create(createRewardDto);

    return createdReward;
  }

  async getRewardDetail(rewardId: string): Promise<RewardDocument> {
    if (!Types.ObjectId.isValid(rewardId)) {
      throw new BadRequestException('유효하지 않은 보상 ID입니다');
    }

    const reward = await this.getRewardById(rewardId);

    if (!reward) {
      throw new NotFoundException('보상을 찾을 수 없습니다');
    }

    return reward;
  }

  async getRewardList(getRewardListDto: GetRewardListDto): Promise<{
    rewards: RewardDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const filter: RewardFilter = {};

    if (getRewardListDto.type) {
      filter.type = getRewardListDto.type;
    }

    const skip = (getRewardListDto.page - 1) * getRewardListDto.limit;

    const [rewards, total] = await Promise.all([
      this.rewardModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(getRewardListDto.limit),
      this.rewardModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / getRewardListDto.limit);

    return {
      rewards,
      total,
      page: getRewardListDto.page,
      totalPages,
    };
  }

  async getRewardById(rewardId: string): Promise<RewardDocument> {
    const reward = await this.rewardModel.findById(rewardId);
    return reward;
  }

  async getRewardsByIds(ids: string[]): Promise<Reward[]> {
    return await this.rewardModel.find({ _id: { $in: ids } });
  }
}
