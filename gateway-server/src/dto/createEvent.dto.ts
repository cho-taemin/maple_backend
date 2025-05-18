// dto/create-event.dto.ts
import {
  IsString,
  IsEnum,
  IsDate,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  ArrayNotEmpty,
} from 'class-validator';
import { EventStatus } from '../type/enum/eventStatus.enum';
import { EventsCondition } from '../type/enum/eventCondition.enum';
import { RewardPayType } from '../type/enum/rewardPayType.enum';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString({ message: '이벤트 이름은 문자열이어야 합니다' })
  @IsNotEmpty({ message: '이벤트 이름을 입력해주세요' })
  name: string;

  @IsString({ message: '이벤트 설명은 문자열이어야 합니다' })
  @IsNotEmpty({ message: '이벤트 설명을 입력해주세요' })
  description: string;

  @IsEnum(EventStatus, { message: '유효한 이벤트 상태가 아닙니다' })
  @IsNotEmpty({ message: '이벤트 상태를 입력해주세요' })
  status: EventStatus;

  @IsEnum(EventsCondition, {
    each: true,
    message: '유효한 이벤트 조건이 아닙니다',
  })
  @IsNotEmpty({ message: '이벤트 조건을 입력해주세요' })
  conditions: EventsCondition[];

  @IsEnum(RewardPayType, { message: '유효한 보상 지급 방식이 아닙니다' })
  @IsNotEmpty({ message: '이벤트 보상 지급 방식을 입력해주세요' })
  rewardPayType: RewardPayType;

  @IsDate({ message: '유효한 날짜 형식이 아닙니다' })
  @Type(() => Date)
  @IsNotEmpty({ message: '이벤트 시작일을 입력해주세요' })
  startDate: Date;

  @IsDate({ message: '유효한 날짜 형식이 아닙니다' })
  @Type(() => Date)
  @IsNotEmpty({ message: '이벤트 종료일을 입력해주세요' })
  endDate: Date;

  @IsArray({ message: '보상 ID 목록은 배열이어야 합니다' })
  @ArrayNotEmpty({ message: '최소 하나 이상의 보상 ID가 필요합니다' })
  @IsMongoId({ each: true, message: '유효한 보상 ID 형식이 아닙니다' })
  rewards: string[];
}
