// ============================================================================
// File Name: telegram.controller.ts
// Exact Location: backend/src/telegram/telegram.controller.ts
// Description: The traffic cop for Telegram actions. Protected by the JWT Bouncer!
// ============================================================================

import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TelegramService } from './telegram.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'; // <-- The Bouncer!

// The Bouncer locks down this entire controller!
@UseGuards(JwtAuthGuard)
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  // Sends a private alert to a specific user (e.g., "Your job was approved")
  @Post('send')
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.telegramService.sendMessage(sendMessageDto);
  }

  // Broadcasts a job to the public main channel (e.g., @EthioSiraJobs)
  @Post('broadcast')
  broadcastToChannel(@Body('message') message: string) {
    return this.telegramService.broadcastToChannel(message);
  }
}