// ============================================================================
// File Name: settings.controller.ts
// Exact Location: backend/src/settings/settings.controller.ts
// Description: The traffic cop for System Settings. Protected by the JWT Bouncer!
// ============================================================================

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { CreateSettingDto } from './dto/create-setting.dto.js';
import { UpdateSettingDto } from './dto/update-setting.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // The Bouncer stands here! Only Admins can initialize settings.
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  // NO Bouncer! The Next.js frontend needs to fetch this to show the logo and banners.
  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  // NO Bouncer! Fetching specific settings is public.
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settingsService.findOne(+id);
  }

  // The Bouncer stands here! Only Admins can change the banners/logos.
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(+id, updateSettingDto);
  }

  // The Bouncer stands here! (Though the service actually blocks this action anyway for safety).
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingsService.remove(+id);
  }
}