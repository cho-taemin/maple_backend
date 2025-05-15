import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Ping, PingSchema } from './ping.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, {}),
    MongooseModule.forFeature([{ name: Ping.name, schema: PingSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
