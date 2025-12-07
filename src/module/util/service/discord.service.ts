import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DiscordService {
  private readonly webhookUrl: string;

  constructor(private readonly config: ConfigService) {
    this.webhookUrl = this.config.get('DISCORD_WEBHOOK');
  }

  async sendReport(title: string, content: string) {
    const payload = {
      content: '[신고]',
      embeds: [
        {
          title: title,
          description: content,
        },
      ],
    };
    return this.sendDiscordMessage(payload);
  }

  async sendDiscordMessage(payload: any) {
    await axios.post(this.webhookUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
