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
  @IsString()
  @IsNotEmpty({ message: '보상 이름을 입력해주세요' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '보상 설명을 입력해주세요' })
  description: string;

  @IsEnum(RewardType)
  @IsNotEmpty({ message: '보상 타입을 입력해주세요' })
  type: RewardType;

  @IsNumber()
  @IsNotEmpty({ message: '보상 값을 입력해주세요' })
  value: number;

  @IsOptional()
  @IsDate({ message: '유효한 날짜 형식이 아닙니다.' })
  @Type(() => Date)
  expiryDate?: Date;
}
