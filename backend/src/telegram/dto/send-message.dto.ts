// ============================================================================
// File Name: send-message.dto.ts
// Exact Location: backend/src/telegram/dto/send-message.dto.ts
// Description: Rules for sending a Telegram message via the API.
// ============================================================================

import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SendMessageDto {
  // The actual text message to be sent
  @IsString()
  @IsNotEmpty({ message: 'You cannot send an empty Telegram message.' })
  message: string;
  
  // The user's Telegram ID. It uses '?' because if it is missing, 
  // we broadcast to the main public channel instead.
  @IsOptional()
  @IsString()
  chatId?: string;
}