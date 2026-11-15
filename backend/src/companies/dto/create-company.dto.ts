// ============================================================================
// File Name: create-company.dto.ts
// Exact Location: backend/src/companies/dto/create-company.dto.ts
// Description: Strict validation rules for registering a new hiring company.
// ============================================================================

import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty({ message: 'A company name is required.' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Logo must be a valid image URL or data string.' })
  logoUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid website URL.' })
  website?: string;
}