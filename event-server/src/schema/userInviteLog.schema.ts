import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'user_invite_log',
})
export class UserInviteLog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  referralUserId: MongooseSchema.Types.ObjectId;
}

export type UserInviteLogDocument = UserInviteLog & Document;
export const UserInviteLogSchema = SchemaFactory.createForClass(UserInviteLog);

UserInviteLogSchema.index({ userId: 1 });
UserInviteLogSchema.index({ referralUserId: 1 });
