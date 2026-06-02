import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.service.login(loginDto);
  }
}