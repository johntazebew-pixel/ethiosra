import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Controller('auth') // URL: http://localhost:3000/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Handles: POST http://localhost:3000/auth/login
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Handles: POST http://localhost:3000/auth/register
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.registerJobSeeker(registerDto);
  }
}