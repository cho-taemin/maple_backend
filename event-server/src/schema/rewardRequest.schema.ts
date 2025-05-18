import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { RewardRequestStatus } from 'src/type/enum/rewardRequest.enum';

class FailureInfo {
  @Prop({ type: Date })
  at: Date;

  @Prop({ type: String })
  reason: string;
}

@Schema({ timestamps: true, collection: 'reward_request' })
export class RewardRequest {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Event' })
  eventId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Reward' }],
    required: true,
  })
  rewardIds: Types.ObjectId[]; //런타임, 컴파일 차이

  @Prop({
    required: true,
    enum: RewardRequestStatus,
  })
  status: RewardRequestStatus;

  @Prop()
  requestAt: Date;

  @Prop()
  processedAt: Date;

  @Prop({ type: FailureInfo })
  failure: FailureInfo;
}

export type RewardRequestDocument = RewardRequest & Document;
export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
