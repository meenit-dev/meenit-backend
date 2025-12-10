import { Module } from '@nestjs/common';
import { NoticeModule } from './notice/notice.module';
import { FaqModule } from './faq/faq.module';

@Module({
  imports: [NoticeModule, FaqModule],
})
export class SupportModule {}
