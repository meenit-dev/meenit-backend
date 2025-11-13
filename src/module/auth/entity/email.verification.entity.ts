import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { makeCertificateCode } from '@common/util';
import { addMinutes, startOfMinute } from 'date-fns';
import { UUIDEntity } from '@common/entity/uuid.entity';

@Entity({ name: 'email_verification' })
export class EmailVerification extends UUIDEntity {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @Column({ name: 'expired_at' })
  expiredAt: Date;

  @Column({
    default: null,
    nullable: true,
    name: 'used_at',
    type: 'timestamptz',
  })
  usedAt: Date | null;

  @Column({ nullable: false, type: String })
  @Index()
  email: string;

  @Column({ nullable: false, type: String })
  code: string;

  static of(email: string): EmailVerification {
    const emailVerification = new EmailVerification();
    emailVerification.email = email;
    emailVerification.expiredAt = addMinutes(startOfMinute(new Date()), 5);
    emailVerification.code = makeCertificateCode(6);
    return emailVerification;
  }

  use(): EmailVerification {
    this.usedAt = new Date();
    return this;
  }
}
