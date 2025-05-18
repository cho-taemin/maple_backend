import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardRequestService } from './rewardRequest.service';
import { RewardRequestController } from './rewardRequest.controller';
import {
  RewardRequest,
  RewardRequestSchema,
} from 'src/schema/rewardRequest.schema';
import { EventsModule } from '../event/events.module';
import { RewardsModule } from '../reward/rewards.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
    EventsModule,
    RewardsModule,
  ],
  controllers: [RewardRequestController],
  providers: [RewardRequestService],
  exports: [RewardRequestService],
})
export class RewardRequestModule {}
