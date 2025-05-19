import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class RewardIdRequiredDto {
  @IsMongoId({ message: '유효한 ID 형식이 아닙니다' })
  @IsNotEmpty({ message: 'ID를 입력해주세요' })
  rewardId: string;
}

export class RewardIdOptionalDto {
  @IsMongoId({ message: '유효한 ID 형식이 아닙니다' })
  @IsOptional()
  rewardId?: string;
}
