import * as crypto from 'crypto';

export const IsProduction = process.env.NODE_ENV === 'production';

export function encryptSha512(password: string, salt: string) {
  return crypto
    .pbkdf2Sync(password, salt, 999, 64, 'sha512')
    .toString('base64');
}

export function makeCertificateCode(length = 6) {
  return Math.floor(Math.random() * Number('1' + '0'.repeat(length)))
    .toString()
    .padStart(length, '0');
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateHashedColor(str: string) {
  const hash = crypto.createHash('md5').update(str).digest('hex');
  return `#${hash.substring(0, 6)}`;
}

export function generateSecureRandomId(length = 10): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}
