import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { EventStatus } from '../type/enum/eventStatus.enum';
import { EventsCondition } from '../type/enum/eventCondition.enum';
import { RewardPayType } from '../type/enum/rewardPayType.enum';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: EventStatus, default: EventStatus.CLOSED })
  status: EventStatus;

  @Prop({ type: [String], enum: EventsCondition })
  conditions: EventsCondition[];

  @Prop({ type: String, enum: RewardPayType })
  rewardType: RewardPayType;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Reward' }] })
  rewards: MongooseSchema.Types.ObjectId[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
