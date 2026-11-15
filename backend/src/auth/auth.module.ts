// ============================================================================
// File Name: auth.module.ts
// Exact Location: backend/src/auth/auth.module.ts
// Description: The configuration file that bundles all Auth security tools.
// ============================================================================

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module.js';
import { JwtStrategy } from './jwt.strategy.js';

@Module({
  imports: [
    PrismaModule, // Needed to check if the user exists in the DB
    PassportModule,
    // We configure the JWT Engine here
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-hard-to-guess-key', // We will put this in .env later
      signOptions: { expiresIn: '1d' }, // The token expires in 1 Day
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // <-- Added the JwtStrategy here!
})
export class AuthModule {}