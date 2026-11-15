// ============================================================================
// File Name: jobs.controller.ts
// Exact Location: backend/src/jobs/jobs.controller.ts
// Description: The traffic cop for Jobs. Protected by the JWT Bouncer!
// ============================================================================

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JobsService } from './jobs.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateJobDto } from './dto/update-job.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'; // <-- Bringing in the Bouncer!

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // The Bouncer stands here! You MUST have a valid token to post a job.
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() createJobDto: CreateJobDto) {
    // req.user comes from the digital ID card (token) after the Bouncer checks it!
    const adminId = req.user?.userId || req.user?.sub || req.user?.id; 
    return this.jobsService.create(createJobDto, adminId);
  }

  // NO Bouncer here! Anyone on the internet can see the list of jobs.
  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  // SuperAdmin & Admin: fetch all jobs including Draft and Pending Deletion
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  findAllAdmin() {
    return this.jobsService.findAllAdmin();
  }

  // NO Bouncer here! Anyone can click on a specific job to read it.
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  // The Bouncer stands here! Only logged-in users can update jobs.
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  // The Bouncer stands here! Only logged-in users can request deletion.
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }

  // SuperAdmin direct force delete (permanent purge)
  @UseGuards(JwtAuthGuard)
  @Delete(':id/force')
  forceDelete(@Param('id') id: string) {
    return this.jobsService.forceDelete(id);
  }
}