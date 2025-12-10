import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from './entity/faq.entity';
import { FaqService } from './service/faq.service';
import { FaqRepository } from './repository/faq.repository';
import { FaqController } from './controller/faq.controller';
import { BoFaqController } from './controller/bo.faq.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  providers: [FaqService, FaqRepository],
  controllers: [FaqController, BoFaqController],
  exports: [FaqService],
})
export class FaqModule {}
