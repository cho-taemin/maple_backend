import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RewardType } from '../type/enum/rewardType.enum';

@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: RewardType })
  type: RewardType;

  @Prop({ required: true })
  value: number;

  @Prop()
  expiryDate: Date;
}

export type RewardDocument = Reward & Document;
export const RewardSchema = SchemaFactory.createForClass(Reward);
