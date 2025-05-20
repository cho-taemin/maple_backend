// dto/create-event.dto.ts
import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';
import { RewardType } from '../type/enum/rewardType.enum';
import { Type } from 'class-transformer';

export class CreateRewardDto {
  @IsString({ message: '보상 이름은 문자열이어야 합니다' })
  @IsNotEmpty({ message: '보상 이름을 입력해주세요' })
  name: string;

  @IsString({ message: '보상 설명은 문자열이어야 합니다' })
  @IsNotEmpty({ message: '보상 설명을 입력해주세요' })
  description: string;

  @IsEnum(RewardType, { message: '유효한 보상 타입이 아닙니다' })
  @IsNotEmpty({ message: '보상 타입을 입력해주세요' })
  type: RewardType;

  @IsNumber({}, { message: '보상 값은 숫자여야 합니다' })
  @IsNotEmpty({ message: '보상 값을 입력해주세요' })
  value: number;
}
