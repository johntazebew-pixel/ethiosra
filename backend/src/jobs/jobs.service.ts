// ============================================================================
// File Name: jobs.service.ts
// Exact Location: backend/src/jobs/jobs.service.ts
// Description: The database engine that saves and retrieves Jobs using Prisma,
//              supporting multi-categories and professional vacancy details.
// ============================================================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateJobDto } from './dto/update-job.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto, adminId: string) {
    const { categoryIds, ...jobData } = createJobDto;

    const newJob = await this.prisma.job.create({
      data: {
        ...jobData,
        deadlineDate: new Date(createJobDto.deadlineDate),
        status: createJobDto.status || 'PUBLISHED',
        postedById: adminId,
        categories:
          categoryIds && categoryIds.length > 0
            ? {
                create: categoryIds.map((categoryId) => ({
                  category: { connect: { id: categoryId } },
                })),
              }
            : undefined,
      },
      include: {
        company: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return newJob;
  }

  async findAll() {
    return this.prisma.job.findMany({
      where: { isDeleted: false },
      include: {
        company: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        categories: {
          include: {
            category: true,
          },
        },
        postedBy: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Error! Job with ID ${id} not found.`);
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const { categoryIds, ...jobData } = updateJobDto;

    const categoriesUpdate = categoryIds
      ? {
          deleteMany: {},
          create: categoryIds.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        }
      : undefined;

    return this.prisma.job.update({
      where: { id },
      data: {
        ...jobData,
        deadlineDate: jobData.deadlineDate ? new Date(jobData.deadlineDate) : undefined,
        categories: categoriesUpdate,
      },
      include: {
        company: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async findAllAdmin() {
    return this.prisma.job.findMany({
      include: {
        company: true,
        categories: {
          include: {
            category: true,
          },
        },
        postedBy: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string) {
    return this.prisma.job.update({
      where: { id },
      data: { isDeleted: true, status: 'PENDING_DELETION' },
    });
  }

  async forceDelete(id: string) {
    await this.prisma.jobCategory.deleteMany({
      where: { jobId: id },
    });
    return this.prisma.job.delete({
      where: { id },
    });
  }
}