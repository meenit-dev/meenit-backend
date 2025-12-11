import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { InquiryResource } from '../entity/inquiry.resource.entity';

@Injectable()
export class InquiryResourceRepository extends CommonRepository<InquiryResource> {
  protected readonly logger = new Logger(InquiryResourceRepository.name);

  constructor(
    @InjectRepository(InquiryResource)
    protected readonly repository: Repository<InquiryResource>,
  ) {
    super();
  }
}
