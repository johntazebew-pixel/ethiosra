import { existsSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';

export const uploadDirectory = process.env.UPLOADS_DIR?.trim()
  ? resolve(process.env.UPLOADS_DIR)
  : join(process.cwd(), 'uploads');

if (!existsSync(uploadDirectory)) {
  mkdirSync(uploadDirectory, { recursive: true });
}
