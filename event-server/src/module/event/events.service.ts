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
import { EventFilter } from '../../type/interface/eventFilter.interface';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
  ) {}
  //   async create(createUserDto: CreateUserDto): Promise<User> {
  //     const isExists = await this.findUserByEmail(createUserDto.email);

  //     if (isExists) throw new ConflictException('email exists');
  //     const hash = await bcrypt.hash(createUserDto.password, 10);

  //     return this.userModel.create({ ...createUserDto, password: hash });
  //   }

  //   async findUserByEmail(email: string): Promise<User> {
  //     const user = await this.userModel.findOne({ email });

  //     return user;
  //   }

  async createEvent(createEventDto: CreateEventDto): Promise<EventDocument> {
    try {
      const { startDate, endDate } = createEventDto;
      if (new Date(startDate) < new Date()) {
        throw new BadRequestException(
          '시작일은 현재 시간보다 나중이어야 합니다.',
        );
      }

      if (new Date(startDate) >= new Date(endDate)) {
        throw new BadRequestException('종료일은 시작일보다 나중이어야 합니다.');
      }

      const rewardIds = createEventDto.rewards;
      const existingRewards = await this.rewardModel.find({
        _id: { $in: rewardIds },
      });

      if (existingRewards.length !== rewardIds.length) {
        throw new BadRequestException('일부 보상이 유효하지 않습니다.');
      }

      const createdEvent = await this.eventModel.create(createEventDto);

      return this.eventModel.findById(createdEvent._id).populate('rewards');
    } catch (error) {
      throw error;
    }
  }

  async getEventDetail(eventId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new BadRequestException('유효하지 않은 이벤트 ID입니다.');
      }

      const event = await this.eventModel.findById(eventId).populate('rewards');

      if (!event) {
        throw new NotFoundException('이벤트를 찾을 수 없습니다.');
      }

      return event;
    } catch (error) {
      throw error;
    }
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
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async createReward() {}
  async getRewardDetail() {}
  async getrewardList() {}

  async requestReward() {}
  async requestRewardList() {}

  async validateCondition() {}
}
