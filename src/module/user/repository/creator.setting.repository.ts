import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { CreatorSetting } from '../entity/creator.setting.entity';
import { UUID } from '@common/type';

@Injectable()
export class CreatorSettingRepository extends CommonRepository<CreatorSetting> {
  protected readonly logger = new Logger(CreatorSettingRepository.name);

  constructor(
    @InjectRepository(CreatorSetting)
    protected readonly repository: Repository<CreatorSetting>,
  ) {
    super();
  }

  async findOneByUserId(userId: UUID) {
    return this.repository.findOne({
      where: { userId },
    });
  }
}
