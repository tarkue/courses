import { v4 } from 'uuid';

export function generateHex(): string {
  const buffer = Buffer.alloc(16);
  v4(null, buffer);
  return buffer.toString('hex');
}
