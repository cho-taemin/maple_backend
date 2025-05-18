import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from '../../dto/createEvent.dto';
import { EventDocument } from '../../schema/events.schema';
import { EventStatus } from '../../type/enum/eventStatus.enum';
import { EventsCondition } from '../../type/enum/eventCondition.enum';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(
    @Body(ValidationPipe) createEventDto: CreateEventDto,
  ): Promise<EventDocument> {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get(':id')
  async getEventDetail(@Param('id') eventId: string) {
    return this.eventsService.getEventDetail(eventId);
  }

  @Get()
  async getEventList(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: EventStatus,
    @Query('condition') condition?: EventsCondition,
  ) {
    return this.eventsService.getEventList(
      page ? +page : 1,
      limit ? +limit : 10,
      status,
      condition,
    );
  }

  @Get(':eventId/check-conditions')
  async checkEventConditions(
    @Param('eventId') eventId: string,
    @Query('userId') userId: string,
  ) {
    return this.eventsService.checkEventConditions(userId, eventId);
  }
}
