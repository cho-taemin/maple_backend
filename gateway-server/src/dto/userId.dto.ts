import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UserIdRequiredDto {
  @IsMongoId({ message: '유효한 ID 형식이 아닙니다' })
  @IsNotEmpty({ message: 'ID를 입력해주세요' })
  userId: string;
}

export class UserIdOptionalDto {
  @IsMongoId({ message: '유효한 ID 형식이 아닙니다' })
  @IsOptional()
  userId?: string;
}
