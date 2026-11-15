// ============================================================================
// File Name: uploads.module.ts
// Exact Location: backend/src/uploads/uploads.module.ts
// Description: Module bundling upload handling for logos and static media.
// ============================================================================

import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller.js';

@Module({
  controllers: [UploadsController],
})
export class UploadsModule {}
