import { Module } from '@nestjs/common';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [NoticeModule],
})
export class SupportModule {}
