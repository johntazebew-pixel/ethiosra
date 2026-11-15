// ============================================================================
// File Name: update-company.dto.ts
// Exact Location: backend/src/companies/dto/update-company.dto.ts
// Description: Rules for updating a company profile.
// ============================================================================

import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto.js';

// PartialType makes all fields from CreateCompanyDto optional for updates
export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}