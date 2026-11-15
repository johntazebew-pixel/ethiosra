// ============================================================================
// File Name: jwt-auth.guard.ts
// Exact Location: backend/src/auth/guards/jwt-auth.guard.ts
// Description: The Bouncer that protects our routes using JWT Tokens.
// ============================================================================

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// This is the actual @UseGuards(JwtAuthGuard) tag we place on our protected routes!
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}