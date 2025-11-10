import * as crypto from 'crypto';

export const IsProduction = process.env.APP_ENV === 'prd';

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
