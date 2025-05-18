// user-login-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'user_access_log',
})
export class UserAccessLog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export type UserAccessLogDocument = UserAccessLog & Document;
export const UserAccessLogSchema = SchemaFactory.createForClass(UserAccessLog);

UserAccessLogSchema.index({ loginAt: -1 });
UserAccessLogSchema.index({ userId: 1 });
