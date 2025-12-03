import { Injectable } from '@nestjs/common';
import { TagService } from 'src/module/tag/service/tag.service';
import { UserService } from 'src/module/user/service/user.service';
import { GetCreatorsQueryDto } from '../dto/creator.dto';
import { UserPayload } from 'src/module/auth/type/auth.type';

@Injectable()
export class CreatorService {
  constructor(
    private readonly userService: UserService,
    private readonly tagService: TagService,
  ) {}

  async getCreatorPagination(query: GetCreatorsQueryDto, user?: UserPayload) {
    const tagIds = query.tags
      ? (await this.tagService.getTagsByNames(query.tags)).map((tag) => tag.id)
      : undefined;
    return this.userService.getCreatorPagination({
      ...query,
      tagIds,
      requestUserId: user?.id,
    });
  }
}
