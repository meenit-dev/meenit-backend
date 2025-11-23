import { Injectable } from '@nestjs/common';
import { TagRepository } from '../repository/tag.repository';
import { UUID } from '@common/type';
import { DefaultTags } from '../data/default.tag';
import { Tag } from '../entity/tag.entity';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async initTag() {
    DefaultTags.forEach((tag) => this.tagRepository.save(Tag.of(tag)));
  }

  async getTagsByNames(names: string[]) {
    return this.tagRepository.findManyByNames(names);
  }

  async getUsedTop20TagsByName(name?: string) {
    return this.tagRepository.findUsedTop20ByName(name);
  }

  async increseCountByIds(ids: UUID[]) {
    await this.tagRepository.increseCountByIds(ids);
  }
}
