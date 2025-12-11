import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportService } from '../service/report.service';
import { CreateReportBodyDto } from '../dto/report.dto';
import { AuthUserGuard } from 'src/module/auth/guard/auth.user.guard';
import { ReqUser } from '@common/decorator';
import { UserPayload } from 'src/module/auth/type/auth.type';

@Controller({ path: 'reports', version: '1' })
@ApiTags('Report')
@UseGuards(AuthUserGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiOperation({ summary: '신고하기' })
  async createReport(
    @Body() body: CreateReportBodyDto,
    @ReqUser() user: UserPayload,
  ) {
    await this.reportService.createReport(user.id, body);
  }
}
