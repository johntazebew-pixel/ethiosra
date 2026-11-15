// ============================================================================
// File Name: create-job.dto.ts
// Exact Location: backend/src/jobs/dto/create-job.dto.ts
// Description: Validation rules for posting a new job with multi-categories
//              and comprehensive professional vacancy attributes.
// ============================================================================

import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsIn,
  IsUrl,
  IsArray,
  IsUUID,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty({ message: 'A job title is required.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'A job description is required.' })
  description: string;

  // Ensures the frontend sends a proper Date format (e.g., '2026-12-31')
  @IsDateString({}, { message: 'Please provide a valid deadline date.' })
  @IsNotEmpty()
  deadlineDate: string;

  // Strict check: It MUST be one of these exact four methods
  @IsIn(['TELEGRAM', 'WEBSITE', 'EMAIL', 'GOOGLE_FORM'], {
    message: 'Method must be TELEGRAM, WEBSITE, EMAIL, or GOOGLE_FORM',
  })
  @IsNotEmpty()
  applicationMethod: 'TELEGRAM' | 'WEBSITE' | 'EMAIL' | 'GOOGLE_FORM';

  // Ensures the provided application link is a real, working web address
  @IsUrl({}, { message: 'Please provide a valid application URL link.' })
  @IsNotEmpty()
  applicationUrl: string;

  // Ensures the company ID is a secure PostgreSQL UUID
  @IsUUID('all', { message: 'Invalid Company ID format.' })
  @IsNotEmpty()
  companyId: string;

  // Multi-select categories support
  @IsArray()
  @IsString({ each: true, message: 'Each category ID must be a valid string.' })
  @IsNotEmpty({ message: 'Please select at least one job category.' })
  categoryIds: string[];

  // Professional attributes
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  workplaceType?: string; // ON_SITE, HYBRID, REMOTE

  @IsOptional()
  @IsString()
  employmentType?: string; // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE

  @IsOptional()
  @IsString()
  experienceLevel?: string; // ENTRY_LEVEL, JUNIOR, MID_LEVEL, SENIOR, EXECUTIVE

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minExperienceYears?: number;

  @IsOptional()
  @IsString()
  educationLevel?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  positionsCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMax?: number;

  @IsOptional()
  @IsString()
  salaryCurrency?: string;

  @IsOptional()
  @IsString()
  salaryPeriod?: string;

  @IsOptional()
  @IsBoolean()
  isSalaryNegotiable?: boolean;

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @IsString()
  qualifications?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillsRequired?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsString()
  genderPreference?: string;

  @IsOptional()
  @IsString()
  status?: 'DRAFT' | 'PUBLISHED';
}