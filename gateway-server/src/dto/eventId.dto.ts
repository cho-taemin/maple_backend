import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class EventIdRequiredDto {
  @IsMongoId({ message: '유효한 ID 형식이 아닙니다' })
  @IsNotEmpty({ message: 'ID를 입력해주세요' })
  eventId: string;
}

export class EventIdOptionalDto {
  @IsMongoId({ message: '유효한 ID 형식이 아닙니다' })
  @IsOptional()
  eventId?: string;
}
