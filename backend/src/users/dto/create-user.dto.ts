// ============================================================================
// File Name: create-user.dto.ts
// Exact Location: backend/src/users/dto/create-user.dto.ts
// Description: Strict rules for creating/updating a user profile with EthioJobs career fields.
// ============================================================================

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
  IsBoolean,
  IsInt,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  password: string;

  // Account Role (SuperAdmin manage)
  @IsOptional()
  @IsIn(['SUPERADMIN', 'ADMIN', 'JOB_SEEKER'], {
    message: 'Role must be SUPERADMIN, ADMIN, or JOB_SEEKER',
  })
  role?: 'SUPERADMIN' | 'ADMIN' | 'JOB_SEEKER';

  // Personal Details
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  // Career & Professional Details (EthioJobs Style)
  @IsOptional()
  @IsString()
  currentTitle?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  educationLevel?: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsBoolean()
  isAvailableForHire?: boolean;

  // Links & CV
  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @IsOptional()
  @IsString()
  portfolioUrl?: string;

  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;

  // Preferences & Alerts
  @IsOptional()
  @IsIn(['EN', 'AM'], { message: 'Language must be either EN or AM' })
  preferredLanguage?: 'EN' | 'AM';

  @IsOptional()
  @IsIn(['LIGHT', 'DARK'], { message: 'Theme must be LIGHT or DARK' })
  preferredTheme?: 'LIGHT' | 'DARK';

  @IsOptional()
  @IsString()
  telegramChatId?: string;

  @IsOptional()
  @IsBoolean()
  emailNotificationEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  telegramNotificationEnabled?: boolean;
}