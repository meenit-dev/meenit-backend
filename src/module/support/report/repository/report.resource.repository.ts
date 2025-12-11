import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { ReportResource } from '../entity/report.resource.entity';

@Injectable()
export class ReportResourceRepository extends CommonRepository<ReportResource> {
  protected readonly logger = new Logger(ReportResourceRepository.name);

  constructor(
    @InjectRepository(ReportResource)
    protected readonly repository: Repository<ReportResource>,
  ) {
    super();
  }
}
