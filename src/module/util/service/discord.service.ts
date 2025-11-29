import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class DiscordService {
  private readonly webhookUrl: string;

  constructor(private readonly config: ConfigService) {
    this.webhookUrl = this.config.get('DISCORD_WEBHOOK');
  }

  async sendReport() {
    const payload = {
      content: 'Discord Webhook 메시지입니다.',
      embeds: [
        {
          title: '임베드 테스트',
          description: '임베드 내용입니다.',
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
