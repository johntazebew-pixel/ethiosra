// ============================================================================
// File Name: auth.service.ts
// Exact Location: backend/src/auth/auth.service.ts
// Description: The engine that handles user login and registration.
// ============================================================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // 1. Find the user by their email
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    // 2. If user doesn't exist, throw an error
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Compare the typed password with the scrambled one in the database
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 4. If correct, create their digital ID card (JWT)
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    // 5. Send the token back to the frontend
    return {
      message: 'Login successful!',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }

  async registerJobSeeker(registerDto: RegisterDto) {
    // We hash the password and save the job seeker here
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const newUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        role: 'JOB_SEEKER',
        preferredLanguage: registerDto.preferredLanguage || 'EN',
      },
    });

    // Automatically log them in after registering
    return this.login({ email: registerDto.email, password: registerDto.password });
  }
}