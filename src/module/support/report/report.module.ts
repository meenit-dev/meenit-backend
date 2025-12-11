import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entity/report.entity';
import { ReportService } from './service/report.service';
import { ReportRepository } from './repository/report.repository';
import { ReportController } from './controller/report.controller';
import { ReportTypeRepository } from './repository/report.type.repository';
import { ReportType } from './entity/report.type.entity';
import { ReportResource } from './entity/report.resource.entity';
import { ReportResourceRepository } from './repository/report.resource.repository';
import { UtilModule } from '../../util/util.module';
import { StorageModule } from '../../storage/storage.module';
import { UserModule } from '../../user/user.module';
import { CommissionModule } from '../../commission/commission.module';
import { PortfolioModule } from '../../portfolio/portfolio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, ReportType, ReportResource]),
    UtilModule,
    StorageModule,
    UserModule,
    CommissionModule,
    PortfolioModule,
  ],
  providers: [
    ReportService,
    ReportRepository,
    ReportTypeRepository,
    ReportResourceRepository,
  ],
  controllers: [ReportController],
  exports: [ReportService],
})
export class ReportModule {}
