import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class RewardRequestIdRequiredDto {
  @IsMongoId({ message: '유효한 ID 형식이 아닙니다' })
  @IsNotEmpty({ message: 'ID를 입력해주세요' })
  rewardRequestId: string;
}

export class RewardRequestIdOptionalDto {
  @IsMongoId({ message: '유효한 ID 형식이 아닙니다' })
  @IsOptional()
  rewardRequestId?: string;
}
