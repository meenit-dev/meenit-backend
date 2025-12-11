import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiry } from './entity/inquiry.entity';
import { InquiryService } from './service/inquiry.service';
import { InquiryRepository } from './repository/inquiry.repository';
import { InquiryController } from './controller/inquiry.controller';
import { BoInquiryController } from './controller/bo.inquiry.controller';
import { InquiryResourceRepository } from './repository/inquiry.resource.repository';
import { InquiryResource } from './entity/inquiry.resource.entity';
import { InquiryAnswerRepository } from './repository/inquiry.answer.repository';
import { InquiryAnswer } from './entity/inquiry.answer.entity';
import { StorageModule } from 'src/module/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inquiry, InquiryResource, InquiryAnswer]),
    StorageModule,
  ],
  providers: [
    InquiryService,
    InquiryRepository,
    InquiryResourceRepository,
    InquiryAnswerRepository,
  ],
  controllers: [InquiryController, BoInquiryController],
  exports: [InquiryService],
})
export class InquiryModule {}
