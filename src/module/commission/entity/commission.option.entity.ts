import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CommissionOptionType } from '../type/commission.type';
import { Commission } from './commission.entity';
import { CommissionOptionChoice } from './commission.option.choice.entity';

@Entity({ name: 'commission_option' })
export class CommissionOption extends CommonBaseEntity {
  @Column({ name: 'commission_id', nullable: false, type: 'uuid' })
  @Index()
  commissionId: string;

  @Column({ type: String })
  type: CommissionOptionType;

  @Column({ type: String })
  title: string;

  @Column({ type: String, nullable: true })
  description?: string;

  @Column({ default: false })
  required: boolean;

  @Column({ type: Number })
  order: number;

  @ManyToOne(() => Commission, (c) => c.options, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'commission_id' })
  commission: Commission;

  @OneToMany(() => CommissionOptionChoice, (ch) => ch.option)
  choices: CommissionOptionChoice[];

  static of(createRequest: {
    commissionId: string;
    type: CommissionOptionType;
    title: string;
    description?: string;
    required: boolean;
    order: number;
  }) {
    const option = new CommissionOption();
    option.commissionId = createRequest.commissionId;
    option.type = createRequest.type;
    option.title = createRequest.title;
    option.description = createRequest.description;
    option.required = createRequest.required;
    option.order = createRequest.order;
    return option;
  }
}
