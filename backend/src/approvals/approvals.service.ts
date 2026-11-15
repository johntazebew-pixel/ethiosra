// ============================================================================
// File Name: approvals.service.ts
// Exact Location: backend/src/approvals/approvals.service.ts
// Description: The engine that processes Admin requests and SuperAdmin decisions.
// ============================================================================

import { Injectable } from '@nestjs/common';
import { ApproveDeletionDto } from './dto/approve-deletion.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ApprovalsService {
  constructor(private readonly prisma: PrismaService) {}

  // Step 1: Admin asks to delete a job
  async requestDeletion(jobId: string, adminReason: string) {
    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'PENDING_DELETION',
        isDeleted: true,
        deletionReason: adminReason,
      },
    });
  }

  // Step 2: SuperAdmin looks at all pending requests
  async getPendingApprovals() {
    return this.prisma.job.findMany({
      where: { status: 'PENDING_DELETION' },
      // We include the company and user so the SuperAdmin knows exactly who posted it!
      include: { company: true, postedBy: true }, 
    });
  }

  // Step 3: SuperAdmin approves or rejects the request
  async reviewDeletionRequest(jobId: string, approveDeletionDto: ApproveDeletionDto) {
    
    if (approveDeletionDto.isApproved) {
      // APPROVED: We permanently archive it
      return this.prisma.job.update({
        where: { id: jobId },
        data: { status: 'ARCHIVED' },
      });
    } else {
      // REJECTED: We bring the job back online and clear the deletion reason
      return this.prisma.job.update({
        where: { id: jobId },
        data: { 
          status: 'PUBLISHED', 
          isDeleted: false,
          deletionReason: null 
        },
      });
    }
  }
}