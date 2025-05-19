import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 422,
      stopAtFirstError: true,
    }),
  )
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }
}
