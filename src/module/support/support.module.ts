import { Module } from '@nestjs/common';
import { NoticeModule } from './notice/notice.module';
import { FaqModule } from './faq/faq.module';
import { ReportModule } from './report/report.module';
import { InquiryModule } from './inquiry/inquiry.module';

@Module({
  imports: [NoticeModule, FaqModule, InquiryModule, ReportModule],
})
export class SupportModule {}
