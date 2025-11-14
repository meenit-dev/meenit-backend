import { Injectable } from '@nestjs/common';
import { TagRepository } from '../repository/tag.repository';
import { UUID } from '@common/type';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async getUsedTop20TagsByName(name?: string) {
    return this.tagRepository.findUsedTop20ByName(name);
  }

  async increseCountByIds(ids: UUID[]) {
    await this.tagRepository.increseCountByIds(ids);
  }
}
