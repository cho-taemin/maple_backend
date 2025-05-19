import { Body, Controller, Get, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { CreateRewardDto } from '../../dto/createReward.dto';
import { RewardDocument } from '../../schema/rewards.schema';
import { RewardsService } from './rewards.service';
import { GetRewardListDto } from 'src/dto/getRewardList.dto';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  async createReward(
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    createRewardDto: CreateRewardDto,
  ): Promise<RewardDocument> {
    return this.rewardsService.createReward(createRewardDto);
  }

  @Get(':id')
  async getRewardDetail(@Param('id') rewardId: string): Promise<RewardDocument> {
    return this.rewardsService.getRewardDetail(rewardId);
  }

  @Get()
  async getRewardList(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
        whitelist: true,
      }),
    )
    getRewardListDto: GetRewardListDto,
  ) {
    return this.rewardsService.getRewardList(getRewardListDto);
  }
}
