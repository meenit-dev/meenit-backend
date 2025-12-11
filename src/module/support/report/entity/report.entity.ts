import { UUID } from '@common/type';
import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ReportTargetType } from '../type/report.type';
import { Portfolio } from 'src/module/portfolio/entity/portfolio.entity';
import { User } from 'src/module/user/entity/user.entity';
import { Commission } from 'src/module/commission/entity/commission.entity';
import { ReportType } from './report.type.entity';

@Entity({ name: 'report' })
export class Report extends CommonBaseEntity {
  @Column({ name: 'target_type' })
  targetType: ReportTargetType;

  @Column({ name: 'target_id', type: 'uuid' })
  targetId: UUID;

  @Column()
  reason: string;

  @Column({ name: 'reporter_id', type: 'uuid' })
  reporterId: UUID;

  @Column({ name: 'resolved_at', type: Date, nullable: true })
  resolvedAt?: Date;

  @OneToMany(() => ReportType, (type) => type.report)
  types: ReportType[];

  @ManyToOne(() => Portfolio, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'target_id' })
  portfolio: Portfolio;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'target_id' })
  reportedUser: User;

  @ManyToOne(() => Commission, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'target_id' })
  commission: Commission;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  static of(createRequest: {
    targetType: ReportTargetType;
    targetId: UUID;
    reason: string;
    reporterId: UUID;
  }): Report {
    const report = new Report();
    report.targetType = createRequest.targetType;
    report.targetId = createRequest.targetId;
    report.reason = createRequest.reason;
    report.reporterId = createRequest.reporterId;
    return report;
  }
}
