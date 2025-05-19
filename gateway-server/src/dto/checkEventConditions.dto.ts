import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CheckEventConditionsDto {
  @IsMongoId({ message: '유효한 유저 ID 형식이 아닙니다' })
  @IsNotEmpty({ message: '유저 ID를 입력해주세요' })
  userId: string;
}
