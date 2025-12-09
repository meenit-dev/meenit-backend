import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { UUID } from '@common/type';
import { CommissionOption } from './commission.option.entity';

@Entity({ name: 'commission_option_choice' })
export class CommissionOptionChoice extends CommonBaseEntity {
  @Column({ name: 'option_id', nullable: false, type: 'uuid' })
  @Index()
  optionId: UUID;

  @Column({ type: String })
  label: string;

  @Column({ type: Number })
  order: number;

  @ManyToOne(() => CommissionOption, (opt) => opt.choices, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'option_id' })
  option: CommissionOption;

  static of(createRequest: { optionId: UUID; label: string; order: number }) {
    const choice = new CommissionOptionChoice();
    choice.optionId = createRequest.optionId;
    choice.label = createRequest.label;
    choice.order = createRequest.order;
    return choice;
  }
}
