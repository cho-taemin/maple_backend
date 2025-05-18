// dto/create-event.dto.ts
import {
  IsString,
  IsEnum,
  IsDate,
  IsArray,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { EventStatus } from '../type/enum/eventStatus.enum';
import { EventsCondition } from '../type/enum/eventCondition.enum';
import { RewardPayType } from '../type/enum/rewardPayType.enum';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: '이벤트 이름을 입력해주세요' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '이벤트 설명을 입력해주세요' })
  description: string;

  @IsEnum(EventStatus)
  @IsNotEmpty({ message: '이벤트 상태를 입력해주세요' })
  status: EventStatus;

  @IsEnum(EventsCondition, { each: true })
  @IsNotEmpty({ message: '이벤트 조건을 입력해주세요' })
  conditions: EventsCondition[];

  @IsEnum(RewardPayType)
  @IsNotEmpty({ message: '이벤트 보상 지급 방식을 입력해주세요' })
  rewardPayType: RewardPayType;

  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  @Type(() => Date)
  @IsNotEmpty({ message: '이벤트 시작일을 입력해주세요' })
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: '이벤트 종료일 입력해주세요' })
  endDate: Date;

  @IsMongoId({ each: true })
  @IsArray()
  @IsNotEmpty({ message: '이벤트 보상을 입력해주세요' })
  rewards: string[];
}
