import { Injectable, Logger } from '@nestjs/common';
import { In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonRepository } from '@common/repository/common.repository';
import { Tag } from '../entity/tag.entity';
import { UUID } from '@common/type';

@Injectable()
export class TagRepository extends CommonRepository<Tag> {
  protected readonly logger = new Logger(TagRepository.name);

  constructor(
    @InjectRepository(Tag)
    protected readonly repository: Repository<Tag>,
  ) {
    super();
  }

  async findManyByNames(names: string[]) {
    return this.repository.find({ where: { name: In(names) } });
  }

  async findUsedTop20ByName(name?: string) {
    return this.repository.find({
      where: { ...(name ? { name: Like(`%${name}%`) } : {}) },
      order: {
        count: -1,
        name: 1,
      },
      take: 20,
    });
  }

  async increseCountByIds(ids: UUID[]) {
    await this.repository.increment({ id: In(ids) }, 'count', 1);
  }
}
