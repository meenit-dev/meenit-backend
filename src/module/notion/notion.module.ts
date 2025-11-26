import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotionService } from './service/notion.service';

@Module({
  imports: [ConfigModule],
  providers: [NotionService],
  exports: [NotionService],
})
export class NotionModule {}
