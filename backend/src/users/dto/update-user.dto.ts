// ============================================================================
// File Name: update-user.dto.ts
// Exact Location: backend/src/users/dto/update-user.dto.ts
// Description: Rules for updating a user. Makes all create rules optional.
// ============================================================================

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';

// PartialType automatically copies everything from CreateUserDto 
// but adds @IsOptional() to every single field!
export class UpdateUserDto extends PartialType(CreateUserDto) {}