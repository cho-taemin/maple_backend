import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/type/enum/roles.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true }) email: string;
  @Prop() username: string;
  @Prop() password: string;
  @Prop({ type: [String], enum: Role, default: [Role.USER] }) roles: Role[];
}
export const UserSchema = SchemaFactory.createForClass(User);
