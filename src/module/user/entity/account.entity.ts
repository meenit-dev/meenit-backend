import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { UUID } from '@common/type';

@Entity({ name: 'account' })
export class Account extends CommonBaseEntity {
  @Column({ name: 'user_id', nullable: false, type: String })
  @Index()
  userId: UUID;

  @Column({ nullable: false, type: String })
  name: string;

  @Column({ nullable: false, type: String })
  code: string;

  @Column({ nullable: false, type: String })
  number: string;

  @OneToOne(() => User, (user) => user.account, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  static of(createRequest: {
    userId: UUID;
    name: string;
    code: string;
    number: string;
  }): Account {
    const account = new Account();
    account.userId = createRequest.userId;
    account.name = createRequest.name;
    account.code = createRequest.code;
    account.number = createRequest.number;
    return account;
  }

  update(update: { name: string; code: string; number: string }): Account {
    this.name = update.name;
    this.code = update.code;
    this.number = update.number;
    return this;
  }
}
