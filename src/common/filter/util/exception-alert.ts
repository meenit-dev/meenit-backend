import axios from 'axios';
import * as crypto from 'crypto';
import { Logger } from '@nestjs/common';

export async function sendMessageToTeams(teamsUrl: string, template: any) {
  if (!teamsUrl) {
    return;
  }
  await axios.post(teamsUrl, template);
}

export function hashError(error: any): string {
  const content = JSON.stringify({
    message: error?.message,
    stack: error?.stack,
    name: error?.name,
  });
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function setProcessErrorHandling(errorName: string, logger: Logger) {
  return async (exception: any) => {
    logger.error(`${errorName}: ${exception}`);
  };
}
