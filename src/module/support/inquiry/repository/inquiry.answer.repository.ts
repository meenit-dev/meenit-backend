import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { InquiryAnswer } from '../entity/inquiry.answer.entity';

@Injectable()
export class InquiryAnswerRepository extends CommonRepository<InquiryAnswer> {
  protected readonly logger = new Logger(InquiryAnswerRepository.name);

  constructor(
    @InjectRepository(InquiryAnswer)
    protected readonly repository: Repository<InquiryAnswer>,
  ) {
    super();
  }
}
