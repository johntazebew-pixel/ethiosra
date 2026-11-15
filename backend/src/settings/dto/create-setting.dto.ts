// ============================================================================
// File Name: create-setting.dto.ts
// Exact Location: backend/src/settings/dto/create-setting.dto.ts
// Description: Validation rules for system settings (logos, banners, language).
// ============================================================================

import { IsOptional, IsString, IsIn, IsArray, IsUrl } from 'class-validator';

export class CreateSettingDto {
  @IsOptional()
  @IsString({ message: 'System logo must be a valid string or URL.' })
  systemLogoUrl?: string;

  @IsOptional()
  @IsIn(['EN', 'AM'], { message: 'Default language must be exactly EN or AM.' })
  defaultLanguage?: 'EN' | 'AM';

  // Ensures that if they upload banners, it is a list (array) of valid URLs
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true, message: 'Each hero banner image must be a valid URL.' })
  heroBannerImages?: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true, message: 'Each hero banner video must be a valid URL.' })
  heroBannerVideos?: string[];
}