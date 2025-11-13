import { Injectable, Logger } from '@nestjs/common';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { EmailVerification } from '../entity/email.verification.entity';

@Injectable()
export class EmailVerificationRepository extends CommonRepository<EmailVerification> {
  protected readonly logger = new Logger(EmailVerificationRepository.name);

  constructor(
    @InjectRepository(EmailVerification)
    protected readonly repository: Repository<EmailVerification>,
  ) {
    super();
  }

  async findOneNoUsedByEmailAndCode(email: string, code: string) {
    return this.repository.findOneBy({
      email,
      code,
      usedAt: IsNull(),
      expiredAt: MoreThan(new Date()),
    });
  }

  async deleteNoUsedByEmail(email: string) {
    return this.repository.softDelete({
      email,
      usedAt: IsNull(),
    });
  }
}
