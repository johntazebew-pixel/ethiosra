// ============================================================================
// File Name: update-category.dto.ts
// Exact Location: backend/src/categories/dto/update-category.dto.ts
// Description: Rules for updating a job category.
// ============================================================================

import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto.js';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}