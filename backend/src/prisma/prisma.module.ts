import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

// The @Global() tag means we don't have to import this module 
// into every single folder. It makes Prisma available everywhere!
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // We export it so JobsService and UsersService can use it
})
export class PrismaModule {}