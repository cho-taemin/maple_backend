import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { CreateRewardRequestDto } from 'src/dto/createRewardRequest.dto';
import {
  RewardRequest,
  RewardRequestDocument,
} from 'src/schema/rewardRequest.schema';
import { EventsService } from '../event/events.service';
import { RewardsService } from '../reward/rewards.service';
import { EventStatus } from 'src/type/enum/eventStatus.enum';
import { RewardRequestStatus } from 'src/type/enum/rewardRequest.enum';
import { RewardPayType } from 'src/type/enum/rewardPayType.enum';
import { RewardRequestFilter } from 'src/type/interface/rewardRequest.filter.interface';
import { GetRewardRequestListDto } from 'src/dto/getRewardRequestList.dto';

@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel(RewardRequest.name)
    private rewardRequestModel: Model<RewardRequestDocument>,
    private eventsService: EventsService,
    private rewardsService: RewardsService,
  ) {}

  async createAndAutoProcessRewardRequest(
    createRewardRequestDto: CreateRewardRequestDto,
  ): Promise<RewardRequestDocument> {
    const createdRewardRequest = await this.createRewardRequest(
      createRewardRequestDto,
    );

    const event = await this.eventsService.getEventById(
      createRewardRequestDto.eventId,
    );

    if (!event) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다');
    }

    if (event.rewardPayType === RewardPayType['AUTO']) {
      const checkEventConditions =
        await this.eventsService.checkEventConditions(
          createRewardRequestDto.userId,
          createRewardRequestDto.eventId,
        );

      if (checkEventConditions) {
        /*
              실제 보상 지급 로직 구현 부분
              */

        //보상 자동 지금 기록
        return await this.processRewardRequest(
          createdRewardRequest._id.toString(),
        );
      }
    }
    return createdRewardRequest;
  }

  async processRewardRequest(
    rewardRequestId: string,
  ): Promise<RewardRequestDocument> {
    const updatedRewardRequest =
      await this.rewardRequestModel.findByIdAndUpdate(
        rewardRequestId,
        {
          $set: {
            status: RewardRequestStatus.PROCESSED,
            processedAt: now(),
          },
        },
        { new: true },
      );
    if (!updatedRewardRequest) {
      throw new NotFoundException('유효하지 않은 보상 요청 ID입니다');
    }
    return updatedRewardRequest;
  }

  async createRewardRequest(
    createRewardRequestDto: CreateRewardRequestDto,
  ): Promise<RewardRequestDocument> {
    await this.validateRewardRequest(
      createRewardRequestDto.eventId,
      createRewardRequestDto.rewardIds,
    );

    await this.duplicateRewardRequest(
      createRewardRequestDto.userId,
      createRewardRequestDto.eventId,
      createRewardRequestDto.rewardIds,
    );

    const createdRewardRequest = await this.rewardRequestModel.create({
      userId: createRewardRequestDto.userId,
      eventId: createRewardRequestDto.eventId,
      rewardIds: createRewardRequestDto.rewardIds,
      status: RewardRequestStatus.PENDING,
      requestAt: now(),
    });

    return createdRewardRequest;
  }

  async getRewardRequestsByRequestId(
    rewardRequestId: string,
  ): Promise<RewardRequestDocument> {
    const rewardRequest =
      await this.rewardRequestModel.findById(rewardRequestId);
    if (!rewardRequest) {
      throw new NotFoundException('유효하지 않은 보상 요청 ID입니다');
    }
    return rewardRequest;
  }

  async validateRewardRequest(eventId: string, rewardIds: string[]) {
    const event = await this.eventsService.getEventById(eventId);
    if (!event) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다');
    }

    const rewards = await this.rewardsService.getRewardsByIds(rewardIds);
    if (!rewards || rewards.length !== rewardIds.length) {
      throw new NotFoundException('일부 또는 모든 보상을 찾을 수 없습니다');
    }

    if (event.status !== EventStatus.OPENED) {
      throw new BadRequestException('현재 활성화된 이벤트가 아닙니다');
    }

    const now = new Date();
    if (now < event.startDate || now > event.endDate) {
      throw new BadRequestException('이벤트 기간이 아닙니다');
    }

    return;
  }

  async duplicateRewardRequest(
    userId: string,
    eventId: string,
    rewardIds: string[],
  ) {
    const existingRequest = await this.rewardRequestModel.findOne({
      userId,
      eventId,
      rewardIds,
      status: { $ne: 'FAILED' },
    });

    if (existingRequest) {
      throw new ConflictException(
        '이미 해당 이벤트에 대한 보상을 요청하셨습니다',
      );
    }
    return;
  }

  async getRewardRequests(
    getRewardRequestListDto: GetRewardRequestListDto,
  ): Promise<{
    rewardRequests: RewardRequestDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const filter: RewardRequestFilter = {};
    if (getRewardRequestListDto.userId) {
      filter.userId = getRewardRequestListDto.userId;
    }

    if (getRewardRequestListDto.eventId) {
      filter.eventId = getRewardRequestListDto.eventId;
    }

    if (getRewardRequestListDto.status) {
      filter.status = getRewardRequestListDto.status;
    }

    const skip =
      (getRewardRequestListDto.page - 1) * getRewardRequestListDto.limit;

    const [rewardRequests, total] = await Promise.all([
      this.rewardRequestModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(getRewardRequestListDto.limit),
      this.rewardRequestModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / getRewardRequestListDto.limit);

    return {
      rewardRequests,
      total,
      page: getRewardRequestListDto.page,
      totalPages,
    };
  }
}
