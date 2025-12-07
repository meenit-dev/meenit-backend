import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { Report } from '../entity/report.entity';

@Injectable()
export class ReportRepository extends CommonRepository<Report> {
  protected readonly logger = new Logger(ReportRepository.name);

  constructor(
    @InjectRepository(Report)
    protected readonly repository: Repository<Report>,
  ) {
    super();
  }
}
