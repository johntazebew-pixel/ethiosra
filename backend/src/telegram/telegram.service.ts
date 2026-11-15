// ============================================================================
// File Name: telegram.service.ts
// Exact Location: backend/src/telegram/telegram.service.ts
// Description: The engine that talks to the official Telegram API.
// ============================================================================

import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto.js';

@Injectable()
export class TelegramService {
  
  // Note: Later, we will install 'telegraf' or 'node-telegram-bot-api' to connect 
  // this directly to your actual Telegram Bot Token from BotFather!

  sendMessage(sendMessageDto: SendMessageDto) {
    console.log(`[TELEGRAM API] Sending Private Message to Chat ID ${sendMessageDto.chatId}:`, sendMessageDto.message);
    
    // Future: await bot.telegram.sendMessage(sendMessageDto.chatId, sendMessageDto.message);
    return { message: 'Success! Private Telegram message sent.' };
  }

  broadcastToChannel(message: string) {
    console.log('[TELEGRAM API] Broadcasting to Main Public Channel:', message);
    
    // Future: await bot.telegram.sendMessage('@EthioSiraJobs', message);
    return { message: 'Success! Message broadcasted to the EthioSira channel.' };
  }
}