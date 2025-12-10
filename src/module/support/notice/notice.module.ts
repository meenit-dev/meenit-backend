import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entity/notice.entity';
import { NoticeService } from './service/notice.service';
import { NoticeRepository } from './repository/notice.repository';
import { NoticeController } from './controller/notice.controller';
import { BoNoticeController } from './controller/bo.notice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  providers: [NoticeService, NoticeRepository],
  controllers: [NoticeController, BoNoticeController],
  exports: [NoticeService],
})
export class NoticeModule {}
