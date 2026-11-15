// ============================================================================
// File Name: update-job.dto.ts
// Exact Location: backend/src/jobs/dto/update-job.dto.ts
// Description: Rules for updating a job. Makes all create rules optional.
// ============================================================================

import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto.js';

// PartialType automatically copies everything from CreateJobDto 
// but adds @IsOptional() to every single field!
export class UpdateJobDto extends PartialType(CreateJobDto) {}