import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './module/event/events.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RewardsModule } from './module/reward/rewards.module';
import { RewardRequestModule } from './module/rewardRequest/rewardRequest.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {}),
    EventsModule,
    RewardsModule,
    RewardRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
