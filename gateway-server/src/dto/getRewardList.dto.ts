import { IsEnum, IsOptional, Min, IsInt } from 'class-validator';
import { RewardType } from 'src/type/enum/rewardType.enum';

export class GetRewardListDto {
  @IsOptional()
  @IsInt({ message: '페이지는 정수여야 합니다' })
  @Min(1, { message: '페이지는 1 이상이어야 합니다' })
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: '페이지당 개수는 정수여야 합니다' })
  @Min(1, { message: '페이지당 개수는 1 이상이어야 합니다' })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(RewardType, { message: '유효한 보상 타입이 아닙니다' })
  type?: RewardType;

  // @IsOptional()
  // @IsBoolean({ message: 'isExpired는 불리언 값이어야 합니다.' })
  // @Type(() => Boolean)
  // isExpired?: boolean;
}
