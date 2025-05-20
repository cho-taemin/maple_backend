import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  ForbiddenException,
  Request,
  HttpException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Roles } from '../../auth/decorator/roles.decorator';
import { Public } from '../../auth/decorator/public.decorator';
import {
  LoginDto,
  CreateUserDto,
  CreateEventDto,
  CreateRewardDto,
  CreateRewardRequestDto,
  GetRewardListDto,
  GetRewardRequestListDto,
  GetEventListDto,
} from '../../dto';

@Controller('api')
export class GatewayController {
  private serviceUrls: Record<string, string>;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.serviceUrls = {
      auth: this.configService.get<string>('AUTH_SERVICE_URL'),
      event: this.configService.get<string>('EVENT_SERVICE_URL'),
    };
  }

  private createEndpointUrl(service: 'auth' | 'event', path: string): string {
    return `${this.serviceUrls[service]}/${path}`;
  }

  private async sendRequest<T, R>(
    method: 'post' | 'get' | 'put' | 'delete',
    service: 'auth' | 'event',
    path: string,
    data?: T,
  ): Promise<R> {
    const url = this.createEndpointUrl(service, path);
    try {
      const response = await firstValueFrom(
        this.httpService[method](url, data).pipe(
          map((response) => response.data),
        ),
      );

      return response;
    } catch (error) {
      console.log(error);
      if (error.response) {
        const errorData = error.response.data;
        throw new HttpException(errorData, error.response.status || 500);
      } else {
        throw error;
      }
    }
  }

  // Auth
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.sendRequest<LoginDto, any>(
      'post',
      'auth',
      'auth/login',
      loginDto,
    );
  }

  @Roles('ADMIN')
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.sendRequest<CreateUserDto, any>(
      'post',
      'auth',
      'users/register',
      createUserDto,
    );
  }

  // Event
  @Roles('ADMIN', 'OPERATOR')
  @Post('events')
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.sendRequest<CreateEventDto, any>(
      'post',
      'event',
      'events',
      createEventDto,
    );
  }

  @Roles('ADMIN', 'OPERATOR')
  @Get('events/:eventId')
  async getEventDetail(@Param('eventId') eventId: string) {
    return this.sendRequest<any, any>('get', 'event', `events/${eventId}`);
  }

  @Roles('ADMIN', 'OPERATOR')
  @Get('events')
  async getEventList(@Query() getEventListDto: GetEventListDto) {
    return this.sendRequest<GetEventListDto, any>(
      'get',
      'event',
      'events',
      getEventListDto,
    );
  }

  @Roles('ADMIN', 'OPERATOR')
  @Get('events/:eventId/check-conditions')
  async checkEventConditions(
    @Param('eventId') eventId: string,
    @Query('userId') userId: string,
  ) {
    return this.sendRequest<any, any>(
      'get',
      'event',
      `events/${eventId}/check-conditions?userId=${userId}`,
      undefined,
    );
  }

  // Reward
  @Roles('ADMIN', 'OPERATOR')
  @Post('rewards')
  async createReward(@Body() createRewardDto: CreateRewardDto) {
    return this.sendRequest<CreateRewardDto, any>(
      'post',
      'event',
      'rewards',
      createRewardDto,
    );
  }

  @Roles('ADMIN', 'OPERATOR')
  @Get('rewards/:rewardId')
  async getRewardDetail(@Param('rewardId') rewardId: string) {
    return this.sendRequest<any, any>('get', 'event', `rewards/${rewardId}`);
  }

  @Roles('ADMIN', 'OPERATOR')
  @Get('rewards')
  async getRewardList(@Query() getRewardListDto: GetRewardListDto) {
    return this.sendRequest<GetRewardListDto, any>(
      'get',
      'event',
      'rewards',
      getRewardListDto,
    );
  }

  // RewardRequest
  @Roles('USER')
  @Post('rewardRequest')
  async createRewardRequest(
    @Body() createRewardRequestDto: CreateRewardRequestDto,
  ) {
    return this.sendRequest<CreateRewardRequestDto, any>(
      'post',
      'event',
      'rewardRequests',
      createRewardRequestDto,
    );
  }

  @Roles('ADMIN', 'OPERATOR')
  @Post('rewardRequest/:rewardRequestId/process')
  async processRewardRequest(
    @Param('rewardRequestId') rewardRequestId: string,
  ) {
    return this.sendRequest<any, any>(
      'post',
      'event',
      `rewardRequests/${rewardRequestId}/process`,
    );
  }

  @Get('rewardRequests/:rewardRequestId')
  @Roles('ADMIN', 'AUDITOR', 'USER', 'OPERATOR')
  async getRewardRequestById(
    @Param('rewardRequestId') rewardRequestId: string,
    @Request() req: any,
    @Query('userId') userId?: string,
  ) {
    if (
      req.user.roles === 'ADMIN' ||
      req.user.roles === 'AUDITOR' ||
      req.user.roles === 'OPERATOR'
    ) {
      return this.sendRequest<any, any>(
        'get',
        'event',
        `rewardRequests/${rewardRequestId}`,
      );
    }

    if (req.user.role === 'USER' && userId === req.user.userId) {
      return this.sendRequest<any, any>(
        'get',
        'event',
        `rewardRequests/${rewardRequestId}`,
      );
    }

    throw new ForbiddenException('접근 권한이 없습니다.');
  }

  @Get('rewardRequests')
  @Roles('ADMIN', 'AUDITOR', 'USER', 'OPERATOR')
  async getRewardRequests(
    @Query() getRewardRequestListDto: GetRewardRequestListDto,
    @Request() req: any,
  ) {
    if (
      req.user.roles === 'ADMIN' ||
      req.user.roles === 'AUDITOR' ||
      req.user.roles === 'OPERATOR'
    ) {
      return this.sendRequest<GetRewardRequestListDto, any>(
        'get',
        'event',
        'rewardRequests',
        getRewardRequestListDto,
      );
    }

    if (
      req.user.role === 'USER' &&
      getRewardRequestListDto.userId === req.user.userId
    ) {
      return this.sendRequest<GetRewardRequestListDto, any>(
        'get',
        'event',
        'rewardRequests',
        getRewardRequestListDto,
      );
    }

    throw new ForbiddenException('접근 권한이 없습니다.');
  }
}
