import { IsEnum, IsString } from 'class-validator';
import { Role } from 'src/type/enum/roles.enum';
export class CreateUserDto {
  @IsString() email: string;

  @IsString() username: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  @IsString()
  roles: Role;
}
