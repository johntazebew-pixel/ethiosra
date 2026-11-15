// ============================================================================
// File Name: companies.controller.ts
// Exact Location: backend/src/companies/companies.controller.ts
// Description: The traffic cop for Companies. Protected by the JWT Bouncer!
// ============================================================================

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service.js';
import { CreateCompanyDto } from './dto/create-company.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'; // <-- Bringing in the Bouncer!

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // The Bouncer stands here! Only logged in Admins can create a company.
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  // NO Bouncer! Anyone can see the list of companies.
  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  // NO Bouncer! Anyone can read a specific company's profile.
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  // The Bouncer stands here!
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  // The Bouncer stands here!
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}