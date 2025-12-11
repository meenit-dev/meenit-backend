import { UUID } from '@common/type';
import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Resource } from 'src/module/storage/entity/resource.entity';
import { Report } from './report.entity';

@Entity({ name: 'report_resource' })
export class ReportResource extends CommonBaseEntity {
  @Column({ name: 'report_id', type: 'uuid' })
  reportId: UUID;

  @Column({ name: 'resource_id', type: 'uuid' })
  resourceId: UUID;

  @ManyToOne(() => Report, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @ManyToOne(() => Resource, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'resource_id' })
  resource: Resource;

  static of(createRequest: {
    reportId: UUID;
    resourceId: UUID;
  }): ReportResource {
    const reportResource = new ReportResource();
    reportResource.reportId = createRequest.reportId;
    reportResource.resourceId = createRequest.resourceId;
    return reportResource;
  }
}
