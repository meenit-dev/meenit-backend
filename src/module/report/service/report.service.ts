import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../repository/report.repository';
import { ReportTypeRepository } from '../repository/report.type.repository';
import { ReportResourceRepository } from '../repository/report.resource.repository';
import { DiscordService } from 'src/module/util/service/discord.service';
import { CreateReportBodyDto } from '../dto/report.dto';
import { UUID } from '@common/type';
import { Transactional } from 'typeorm-transactional';
import { Report } from '../entity/report.entity';
import { ReportType } from '../entity/report.type.entity';
import { ResourceService } from 'src/module/storage/service/resource.service';
import { StorageType } from 'src/module/storage/type/storage.type';
import { ReportResource } from '../entity/report.resource.entity';
import { ReportTargetType } from '../type/report.type';
import { CommissionService } from 'src/module/commission/service/commission.service';
import { UserService } from 'src/module/user/service/user.service';
import { PortfolioService } from 'src/module/portfolio/service/portfolio.service';
import { BadRequestError } from '@common/error';

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly reportTypeRepository: ReportTypeRepository,
    private readonly reportResourceRepository: ReportResourceRepository,
    private readonly resourceService: ResourceService,
    private readonly discordService: DiscordService,
    private readonly commissionService: CommissionService,
    private readonly userService: UserService,
    private readonly portfolioService: PortfolioService,
  ) {}

  @Transactional()
  async createReport(reporterId: UUID, createRequest: CreateReportBodyDto) {
    await this.validateRerpot(
      reporterId,
      createRequest.targetType,
      createRequest.targetId,
    );
    const report = await this.reportRepository.save(
      Report.of({ ...createRequest, reporterId }),
    );
    await this.reportTypeRepository.saveMany(
      createRequest.types.map((type) =>
        ReportType.of({ type, reportId: report.id }),
      ),
    );
    if (createRequest.resources) {
      const resources = await Promise.all(
        createRequest.resources.map((url) =>
          this.resourceService.uploadedOrCreateOtherResource(
            reporterId,
            StorageType.REPORT,
            url,
          ),
        ),
      );
      await this.reportResourceRepository.saveMany(
        resources.map((resource) =>
          ReportResource.of({ reportId: report.id, resourceId: resource.id }),
        ),
      );
    }
    await this.discordService.sendReport(
      createRequest.targetType,
      `reporter: ${reporterId} \n type: ${createRequest.types.join(',')}\n reason: ${createRequest.reason}`,
    );
  }

  async validateRerpot(
    reporterId: UUID,
    targetType: ReportTargetType,
    targetId: UUID,
  ) {
    if (targetType === ReportTargetType.COMMISSION) {
      await this.commissionService.getCommissionById(targetId);
    } else if (targetType === ReportTargetType.PORTFOLIO) {
      await this.portfolioService.getPortfolioById(targetId);
    } else if (targetType === ReportTargetType.USER) {
      const user = await this.userService.getUserById(targetId);
      if (user.id === reporterId) {
        throw new BadRequestError();
      }
    }
  }
}
