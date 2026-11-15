// ============================================================================
// File Name: categories.controller.ts
// Exact Location: backend/src/categories/categories.controller.ts
// Description: The traffic cop for Categories. Protected by the JWT Bouncer!
// ============================================================================

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'; // <-- Bringing in the Bouncer!

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // The Bouncer stands here! Only Admins can create a new category.
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // NO Bouncer! The Next.js frontend needs to fetch this to show the search filters.
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // NO Bouncer! Fetching a specific category is public.
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  // The Bouncer stands here!
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // The Bouncer stands here!
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}