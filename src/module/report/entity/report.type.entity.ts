import { UUID } from '@common/type';
import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ReportReasonType } from '../type/report.type';
import { Report } from './report.entity';

@Entity({ name: 'report_type' })
export class ReportType extends CommonBaseEntity {
  @Column({ name: 'type' })
  type: ReportReasonType;

  @Column({ name: 'report_id', type: 'uuid' })
  reportId: UUID;

  @ManyToOne(() => Report, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  static of(createRequest: {
    type: ReportReasonType;
    reportId: UUID;
  }): ReportType {
    const reportType = new ReportType();
    reportType.type = createRequest.type;
    reportType.reportId = createRequest.reportId;
    return reportType;
  }
}
