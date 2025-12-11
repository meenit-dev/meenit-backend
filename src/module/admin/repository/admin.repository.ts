import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { Admin } from '../entity/admin.entity';

@Injectable()
export class AdminRepository extends CommonRepository<Admin> {
  protected readonly logger = new Logger(AdminRepository.name);

  constructor(
    @InjectRepository(Admin)
    protected readonly repository: Repository<Admin>,
  ) {
    super();
  }

  async findOneByEmail(email: string) {
    return this.repository.findOne({
      where: { email },
    });
  }
}
