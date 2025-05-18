import { IsOptional, Min, IsInt, IsMongoId, IsEnum } from 'class-validator';
import { RewardRequestStatus } from 'src/type/enum/rewardRequest.enum';

export class GetRewardRequestListDto {
  @IsOptional()
  @IsInt({ message: '페이지는 정수여야 합니다' })
  @Min(1, { message: '페이지는 1 이상이어야 합니다' })
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: '페이지당 개수는 정수여야 합니다' })
  @Min(1, { message: '페이지당 개수는 1 이상이어야 합니다' })
  limit?: number = 10;

  @IsOptional()
  @IsMongoId({ message: '유효한 유저 ID 형식이 아닙니다' })
  userId?: string;

  @IsOptional()
  @IsMongoId({ message: '유효한 이벤트 ID 형식이 아닙니다' })
  eventId?: string;

  @IsOptional()
  @IsEnum(RewardRequestStatus, { message: '유효한 보상 요청 상태가 아닙니다' })
  status?: RewardRequestStatus;
}
