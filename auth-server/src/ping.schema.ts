// auth-server/src/schemas/ping.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PingDocument = Ping & Document;

@Schema()
export class Ping {
  @Prop({ default: () => new Date() })
  timestamp: Date;

  @Prop({ default: 'hello from auth' })
  message: string;
}

export const PingSchema = SchemaFactory.createForClass(Ping);
