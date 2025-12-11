import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { ReportType } from '../entity/report.type.entity';

@Injectable()
export class ReportTypeRepository extends CommonRepository<ReportType> {
  protected readonly logger = new Logger(ReportTypeRepository.name);

  constructor(
    @InjectRepository(ReportType)
    protected readonly repository: Repository<ReportType>,
  ) {
    super();
  }
}
