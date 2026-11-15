// ============================================================================
// File Name: create-category.dto.ts
// Exact Location: backend/src/categories/dto/create-category.dto.ts
// Description: Strict validation rules for creating a new job category.
// ============================================================================

import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'A category name is required.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Category type is required.' })
  type: string;
}