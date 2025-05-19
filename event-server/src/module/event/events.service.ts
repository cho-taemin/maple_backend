import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { EventDocument } from '../../schema/events.schema';
import { CreateEventDto } from '../../dto/createEvent.dto';
import { Reward, RewardDocument } from '../../schema/rewards.schema';
import { EventStatus } from '../../type/enum/eventStatus.enum';
import { EventsCondition } from '../../type/enum/eventCondition.enum';
import { EventFilter } from '../../type/interface/event.filter.interface';
import {
  UserAccessLog,
  UserAccessLogDocument,
} from 'src/schema/userAccessLog.schema';
import {
  UserInviteLog,
  UserInviteLogDocument,
} from 'src/schema/userInviteLog.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(UserAccessLog.name)
    private userAccessLogModel: Model<UserAccessLogDocument>,
    @InjectModel(UserInviteLog.name)
    private userInviteLogModel: Model<UserInviteLogDocument>,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<EventDocument> {
    const { startDate, endDate } = createEventDto;
    if (new Date(startDate) < new Date()) {
      throw new BadRequestException('시작일은 현재 시간보다 나중이어야 합니다');
    }

    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestException('종료일은 시작일보다 나중이어야 합니다');
    }

    const rewardIds = createEventDto.rewards;
    const existingRewards = await this.rewardModel.find({
      _id: { $in: rewardIds },
    });

    if (existingRewards.length !== rewardIds.length) {
      throw new BadRequestException('일부 보상이 유효하지 않습니다');
    }

    const createdEvent = await this.eventModel.create(createEventDto);

    return await this.getEventById(createdEvent._id.toString());
  }

  async getEventDetail(eventId: string) {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new BadRequestException('유효하지 않은 이벤트 ID입니다');
    }

    const event = await this.getEventById(eventId);

    if (!event) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다');
    }

    return event;
  }

  async getEventList(
    page: number = 1,
    limit: number = 10,
    status?: EventStatus,
    condition?: EventsCondition,
  ): Promise<{
    events: EventDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const filter: EventFilter = {};

    if (status) {
      filter.status = status;
    }

    if (condition) {
      filter.conditions = { $in: [condition] };
    }

    // 쿼리 실행
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      this.eventModel
        .find(filter)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'rewards',
          select: 'name',
        }),
      this.eventModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      events,
      total,
      page,
      totalPages,
    };
  }

  async getEventById(eventId: string): Promise<EventDocument> {
    const event = this.eventModel.findById(eventId).populate('rewards');
    return event;
  }

  async checkEventConditions(
    userId: string,
    eventId: string,
  ): Promise<boolean> {
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다');
    }

    const eventConditions = event.conditions;

    const validationResults = await Promise.all(
      eventConditions.map(async (condition) => {
        switch (condition) {
          case EventsCondition.LOGIN_DAYS:
            return await this.validateLoginDays(userId);
          case EventsCondition.INVITE_USER:
            return await this.validateInviteUser(userId);
          default:
            throw new BadRequestException(
              `지원하지 않는 이벤트 조건: ${condition}`,
            );
        }
      }),
    );

    return validationResults.every((result) => result);
  }

  private async validateLoginDays(userId: string): Promise<boolean> {
    const user = await this.userAccessLogModel.findById(userId);
    if (!user) {
      return false;
    }

    const today = new Date();
    const lastLoginDate = new Date(user.createdAt);

    return (
      today.getFullYear() === lastLoginDate.getFullYear() &&
      today.getMonth() === lastLoginDate.getMonth() &&
      today.getDate() === lastLoginDate.getDate()
    );
  }

  private async validateInviteUser(userId: string): Promise<boolean> {
    const inviteLog = await this.userInviteLogModel.findOne({
      referralUserId: userId,
    });
    return inviteLog ? true : false;
  }
}
