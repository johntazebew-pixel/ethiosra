// ============================================================================
// File Name: jwt.strategy.ts
// Exact Location: backend/src/auth/jwt.strategy.ts
// Description: The Scanner that reads and verifies the user's JWT Token.
// ============================================================================

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // This configures how the scanner reads the token
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Automatically rejects expired tokens
      secretOrKey: process.env.JWT_SECRET || 'super-secret-hard-to-guess-key',
    });
  }

  // If the token is valid, this function extracts the user's data
  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role 
    };
  }
}