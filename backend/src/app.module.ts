import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { JobsModule } from './jobs/jobs.module.js';
import { CompaniesModule } from './companies/companies.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { SettingsModule } from './settings/settings.module.js';
import { TelegramModule } from './telegram/telegram.module.js';
import { ApprovalsModule } from './approvals/approvals.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UploadsModule } from './uploads/uploads.module.js';

@Module({
  imports: [
    UsersModule,
    JobsModule,
    CompaniesModule,
    CategoriesModule,
    SettingsModule,
    TelegramModule,
    ApprovalsModule,
    AuthModule,
    PrismaModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
