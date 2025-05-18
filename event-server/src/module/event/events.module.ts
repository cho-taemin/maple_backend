import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, EventSchema } from '../../schema/events.schema';
import { Reward, RewardSchema } from '../../schema/rewards.schema';
import {
  UserInviteLog,
  UserInviteLogSchema,
} from 'src/schema/userInviteLog.schema';
import {
  UserAccessLog,
  UserAccessLogSchema,
} from 'src/schema/userAccessLog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: UserInviteLog.name, schema: UserInviteLogSchema },
      { name: UserAccessLog.name, schema: UserAccessLogSchema },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
