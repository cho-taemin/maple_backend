import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateRewardRequestDto {
  @IsNotEmpty({ message: '유저 ID를 입력해주세요' })
  @IsMongoId({ message: '유효한 유저 ID 형식이 아닙니다' })
  userId: string;

  @IsNotEmpty({ message: '이벤트 ID를 입력해주세요' })
  @IsMongoId({ message: '유효한 이벤트 ID 형식이 아닙니다' })
  eventId: string;

  @IsArray({ message: '보상 ID 목록은 배열이어야 합니다' })
  @ArrayNotEmpty({ message: '최소 하나 이상의 보상 ID가 필요합니다' })
  @IsMongoId({ each: true, message: '유효한 보상 ID 형식이 아닙니다' })
  rewardIds: string[];
}
