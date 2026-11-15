import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // This function automatically runs when you start the server
  async onModuleInit() {
    console.log('🔌 Connecting to PostgreSQL Database...');
    await this.$connect();
    console.log('✅ Successfully connected to the Database!');
  }
}