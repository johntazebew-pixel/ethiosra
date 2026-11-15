// ============================================================================
// File Name: approvals.controller.ts
// Exact Location: backend/src/approvals/approvals.controller.ts
// Description: The traffic cop for the SuperAdmin Approval system.
// ============================================================================

import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApprovalsService } from './approvals.service.js';
import { ApproveDeletionDto } from './dto/approve-deletion.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

// The Bouncer stands at the main door! Nobody without a token can enter this entire module.
@UseGuards(JwtAuthGuard)
@Controller('approvals') 
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  // 1. Admin sends a request to delete a job
  @Post(':jobId/request')
  requestDeletion(@Param('jobId') jobId: string, @Body('reason') reason: string) {
    return this.approvalsService.requestDeletion(jobId, reason);
  }

  // 2. SuperAdmin checks all pending requests
  @Get('pending')
  getPendingApprovals() {
    return this.approvalsService.getPendingApprovals();
  }

  // 3. SuperAdmin approves or rejects the request
  @Patch(':jobId/review')
  reviewDeletionRequest(
    @Param('jobId') jobId: string, 
    @Body() approveDeletionDto: ApproveDeletionDto
  ) {
    return this.approvalsService.reviewDeletionRequest(jobId, approveDeletionDto);
  }
}