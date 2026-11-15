// ============================================================================
// File Name: update-setting.dto.ts
// Exact Location: backend/src/settings/dto/update-setting.dto.ts
// Description: Rules for updating system settings.
// ============================================================================

import { PartialType } from '@nestjs/mapped-types';
import { CreateSettingDto } from './create-setting.dto.js';

// PartialType makes all fields from CreateSettingDto optional for updates
export class UpdateSettingDto extends PartialType(CreateSettingDto) {}