import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from 'src/roles.enum';

export class CreateUserDto {
  @IsEmail({}, { message: '유효한 이메일을 입력해주세요' })
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  email: string;

  @IsString({ message: '사용자 이름은 문자열이어야 합니다' })
  @IsNotEmpty({ message: '사용자 이름을 입력해주세요' })
  username: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다' })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  password: string;

  @IsOptional()
  @IsString({ message: '추천인 코드는 문자열이어야 합니다' })
  referralCode?: string;

  @IsEnum(Role, { message: '유효한 권한이 아닙니다' })
  @IsNotEmpty({ message: '권한을 선택해주세요' })
  roles: Role;
}
