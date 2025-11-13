export class SendEmailDto {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  sender?: { name?: string; email?: string };
  replyTo?: { name?: string; email: string };
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: { name: string; content: string }[];
}
