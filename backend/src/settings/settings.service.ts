// ============================================================================
// File Name: settings.service.ts
// Exact Location: backend/src/settings/settings.service.ts
// Description: The engine that saves and retrieves global website settings.
// ============================================================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto.js';
import { UpdateSettingDto } from './dto/update-setting.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  // We use 'upsert' here. It means: "If settings exist, update them. If not, create them!"
  // This guarantees we only ever have ONE settings profile (id: 1) for the whole website.
  async create(createSettingDto: CreateSettingDto) {
    return this.prisma.systemSettings.upsert({
      where: { id: 1 },
      update: createSettingDto,
      create: {
        ...createSettingDto,
        id: 1,
      },
    });
  }

  // Fetch the global settings to show on the website
  async findAll() {
    return this.prisma.systemSettings.findFirst();
  }

  // Fetch specifically by ID (usually 1)
  async findOne(id: number) {
    const settings = await this.prisma.systemSettings.findUnique({
      where: { id },
    });
    if (!settings) {
      throw new NotFoundException('System settings have not been configured yet.');
    }
    return settings;
  }

  // Update the global settings (like uploading a new banner)
  async update(id: number, updateSettingDto: UpdateSettingDto) {
    return this.prisma.systemSettings.update({
      where: { id },
      data: updateSettingDto,
    });
  }

  // We block deletion because the website ALWAYS needs a settings profile!
  async remove(id: number) {
    throw new Error('Action blocked! You cannot delete the core system settings.');
  }
}