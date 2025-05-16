import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ping, PingDocument } from './schemas/ping.schema';

@Injectable()
export class AppService {
  constructor(@InjectModel(Ping.name) private pingModel: Model<PingDocument>) {}

  getHello(): string {
    return 'auth-server';
  }

  async createPing(): Promise<Ping> {
    const doc = new this.pingModel({});
    return doc.save();
  }
}
