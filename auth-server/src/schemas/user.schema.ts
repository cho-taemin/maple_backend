import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/type/enum/roles.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true }) email: string;
  @Prop({ required: true }) username: string;
  @Prop({ required: true }) password: string;
  @Prop({ unique: true, required: true }) referralCode: string;
  @Prop({ type: String, enum: Role, required: true }) roles: Role;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
