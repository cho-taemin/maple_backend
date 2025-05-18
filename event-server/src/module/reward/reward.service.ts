import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Reward, RewardDocument } from '../../schema/rewards.schema';
import { RewardType } from '../../type/enum/rewardType.enum';
import { CreateRewardDto } from '../../dto/createReward.dto';
import { RewardFilter } from '../../type/interface/rewardFilter.interface';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}

  async createReward(
    createRewardDto: CreateRewardDto,
  ): Promise<RewardDocument> {
    try {
      if (
        createRewardDto.expiryDate &&
        new Date(createRewardDto.expiryDate) < new Date()
      ) {
        throw new BadRequestException('만료일은 현재 이후여야 합니다.');
      }

      const createdReward = await this.rewardModel.create({ createRewardDto });

      return createdReward;
    } catch (error) {
      throw error;
    }
  }

  async getRewardDetail(rewardId: string): Promise<RewardDocument> {
    try {
      if (!Types.ObjectId.isValid(rewardId)) {
        throw new BadRequestException('유효하지 않은 보상 ID입니다.');
      }

      const reward = await this.rewardModel.findById(rewardId);

      if (!reward) {
        throw new NotFoundException('보상을 찾을 수 없습니다.');
      }

      return reward;
    } catch (error) {
      throw error;
    }
  }

  async getRewardList(
    page: number = 1,
    limit: number = 10,
    type?: RewardType,
    isExpired?: boolean,
  ): Promise<{
    rewards: RewardDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const filter: RewardFilter = {};

      if (type) {
        filter.type = type;
      }

      if (isExpired !== undefined) {
        const now = new Date();

        if (isExpired) {
          filter.expiryDate = { $lt: now };
        } else {
          filter.expiryDate = { $gt: now };
        }
      }

      // 쿼리 실행
      const skip = (page - 1) * limit;

      const [rewards, total] = await Promise.all([
        this.rewardModel
          .find(filter)
          .sort({ createdAt: -1 }) // 최신 보상 우선
          .skip(skip)
          .limit(limit),
        this.rewardModel.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        rewards,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }
}
