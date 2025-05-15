import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ping } from './ping.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ping')
  async ping(): Promise<Ping> {
    return this.appService.createPing();
  }
}
