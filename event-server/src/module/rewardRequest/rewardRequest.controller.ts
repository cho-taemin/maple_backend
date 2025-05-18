import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRewardRequestDto } from 'src/dto/createRewardRequest.dto';
import { GetRewardRequestListDto } from 'src/dto/getRewardRequestList.dto';
import { RewardRequestDocument } from 'src/schema/rewardRequest.schema';
import { RewardRequestService } from './rewardRequest.service';

@Controller('rewardRequests')
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @Post()
  async createRewardRequest(
    @Body() createRewardRequestDto: CreateRewardRequestDto,
  ): Promise<RewardRequestDocument> {
    return this.rewardRequestService.createAndAutoProcessRewardRequest(
      createRewardRequestDto,
    );
  }

  @Post(':id/process')
  async processRewardRequest(
    @Param('id') id: string,
  ): Promise<RewardRequestDocument> {
    return this.rewardRequestService.processRewardRequest(id);
  }

  @Get(':id')
  async getRewardRequestById(
    @Param('id') id: string,
  ): Promise<RewardRequestDocument> {
    return this.rewardRequestService.getRewardRequestsByRequestId(id);
  }

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
      },

      whitelist: true,
      errorHttpStatusCode: 422,
    }),
  )
  async getRewardRequests(
    @Query() getRewardRequestListDto: GetRewardRequestListDto,
  ): Promise<{
    rewardRequests: RewardRequestDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.rewardRequestService.getRewardRequests(getRewardRequestListDto);
  }
}
