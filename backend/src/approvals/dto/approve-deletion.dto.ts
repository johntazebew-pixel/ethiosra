// ============================================================================
// File Name: approve-deletion.dto.ts
// Exact Location: backend/src/approvals/dto/approve-deletion.dto.ts
// Description: Rules for when a SuperAdmin approves or rejects a job deletion.
// ============================================================================

import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApproveDeletionDto {
  // SuperAdmin says YES (true) or NO (false) to the deletion
  @IsBoolean({ message: 'isApproved must be a strict true or false value.' })
  @IsNotEmpty()
  isApproved: boolean;
  
  // Optional: If the SuperAdmin rejects the deletion, they can explain why
  @IsOptional()
  @IsString()
  superAdminNotes?: string;
}