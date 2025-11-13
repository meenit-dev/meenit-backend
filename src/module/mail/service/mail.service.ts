import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from '../dto/mail.dto';
import axios from 'axios';
import { verificationMailTemplate } from '../template/signup.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly apiKey: string;
  private readonly senderEmail: string;
  private readonly senderName?: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get('BREVO_API_KEY') || '';
    this.senderEmail = this.config.get('BREVO_SENDER_EMAIL') || '';
    this.senderName = this.config.get('BREVO_SENDER_NAME');
  }

  private buildPayload(dto: SendEmailDto) {
    const sender = dto.sender || {
      email: this.senderEmail,
      name: this.senderName,
    };

    const toList = Array.isArray(dto.to)
      ? dto.to.map((e) => ({ email: e }))
      : [{ email: dto.to as string }];
    const ccList = dto.cc
      ? Array.isArray(dto.cc)
        ? dto.cc.map((e) => ({ email: e }))
        : [{ email: dto.cc as string }]
      : undefined;
    const bccList = dto.bcc
      ? Array.isArray(dto.bcc)
        ? dto.bcc.map((e) => ({ email: e }))
        : [{ email: dto.bcc as string }]
      : undefined;

    const payload: any = {
      sender,
      to: toList,
      subject: dto.subject,
    };

    if (dto.html) payload.htmlContent = dto.html;
    if (dto.text) payload.textContent = dto.text;
    if (dto.replyTo) payload.replyTo = dto.replyTo;
    if (ccList) payload.cc = ccList;
    if (bccList) payload.bcc = bccList;
    if (dto.attachments)
      payload.attachment = dto.attachments.map((a) => ({
        name: a.name,
        content: a.content,
      }));

    return payload;
  }

  async send(dto: SendEmailDto) {
    const payload = this.buildPayload(dto);

    try {
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        payload,
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
          },
        },
      );
      return response.data;
    } catch (err: any) {
      this.logger.error(
        'Failed to send email',
        err?.response?.data || err?.message || err,
      );
      throw err;
    }
  }

  async sendEmailCertificationMail(
    to: string,
    code: string,
    expiryMinutes: number,
  ) {
    return this.send({
      to,
      subject: '인증번호 발송',
      html: verificationMailTemplate(code, expiryMinutes, 'MeeNiT'),
    });
  }
}
