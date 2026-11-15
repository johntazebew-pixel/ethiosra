// backend/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';

@Module({
  controllers: [UsersController], // Fixed from UsersGateway to UsersController
  providers: [UsersService],
})
export class UsersModule {}