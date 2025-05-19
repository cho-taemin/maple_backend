import { IsEnum, IsOptional, Min, IsInt } from 'class-validator';
import { EventStatus } from '../type/enum/eventStatus.enum';
import { EventsCondition } from '../type/enum/eventCondition.enum';

export class GetEventListDto {
  @IsOptional()
  @IsInt({ message: '페이지는 정수여야 합니다' })
  @Min(1, { message: '페이지는 1 이상이어야 합니다' })
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: '페이지당 개수는 정수여야 합니다' })
  @Min(1, { message: '페이지당 개수는 1 이상이어야 합니다' })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(EventStatus, { message: '유효한 이벤트 상태가 아닙니다' })
  status?: EventStatus;

  @IsOptional()
  @IsEnum(EventsCondition, { message: '유효한 이벤트 조건이 아닙니다' })
  condition?: EventsCondition;
}
