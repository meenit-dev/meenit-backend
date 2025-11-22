import { Injectable } from '@nestjs/common';
import { CommissionRepository } from '../repository/commission.repository';
import { UUID } from '@common/type';
import { ForbiddenError, NotFoundError } from '@common/error';
import { UserService } from 'src/module/user/service/user.service';
import {
  GetCommissionsQueryDto,
  PatchCommissionBodyDto,
  PostCommissionBodyDto,
} from '../dto/commission.dto';
import { Commission } from '../entity/commission.entity';
import { Transactional } from 'typeorm-transactional';
import { TagService } from 'src/module/tag/service/tag.service';
import { CommissionTag } from '../entity/commission.tag.entity';
import { CommissionTagRepository } from '../repository/commission.tag.repository';

@Injectable()
export class CommissionService {
  constructor(
    private readonly tagService: TagService,
    private readonly commissionRepository: CommissionRepository,
    private readonly commissionTagRepository: CommissionTagRepository,
    private readonly userService: UserService,
  ) {}

  @Transactional()
  async createCommission(userId: UUID, body: PostCommissionBodyDto) {
    const tags = await this.tagService.getTagsByNames(body.tags);
    await this.userService.getUserById(userId);
    const commission = await this.commissionRepository.save(
      Commission.of({ userId, ...body }),
    );
    await this.commissionTagRepository.saveMany(
      tags.map((tag) =>
        CommissionTag.of({ tagId: tag.id, commissionId: commission.id }),
      ),
    );
    return this.commissionRepository.findOneWithTagAndUserById(commission.id);
  }

  async getCommissionsPagination(query: GetCommissionsQueryDto) {
    return this.commissionRepository.findAllWithUserAndTagPaginationCategory(
      query.category,
      query,
    );
  }

  async getCommissionsPaginationByHandle(
    handle: string,
    query: GetCommissionsQueryDto,
  ) {
    const userId = await (async () => {
      if (!handle) {
        return undefined;
      }
      const user = await this.userService.getUserByHandle(handle);
      return user.id;
    })();
    return this.commissionRepository.findAllWithUserAndTagPaginationByUserIdAndCategory(
      userId,
      query.category,
      query,
    );
  }

  async getCommissionWithUserAndTagById(id: UUID) {
    const commission =
      await this.commissionRepository.findOneWithTagAndUserById(id);
    if (!commission) {
      throw new NotFoundError();
    }
    return commission;
  }

  async getCommissionById(id: UUID) {
    const commission = await this.commissionRepository.findOneById(id);
    if (!commission) {
      throw new NotFoundError();
    }
    return commission;
  }

  @Transactional()
  async updatecommissionByIdAndUserId(
    id: UUID,
    userId: UUID,
    updateRequest: PatchCommissionBodyDto,
  ) {
    const commission = await this.getCommissionById(id);
    if (commission.userId !== userId) {
      throw new ForbiddenError();
    }
    await this.commissionRepository.save(commission.update(updateRequest));
    if (updateRequest.tags) {
      const tags = await this.tagService.getTagsByNames(updateRequest.tags);
      await this.commissionTagRepository.deleteManyByCommissionId(
        commission.id,
      );
      await this.commissionTagRepository.saveMany(
        tags.map((tag) =>
          CommissionTag.of({ tagId: tag.id, commissionId: commission.id }),
        ),
      );
    }
    return this.commissionRepository.findOneWithTagAndUserById(id);
  }

  async deleteCommissionByIdAndUserId(id: UUID, userId: UUID) {
    const commission = await this.commissionRepository.findOneById(id);
    if (!commission) {
      return;
    }
    if (commission.userId !== userId) {
      throw new ForbiddenError();
    }
    await this.commissionRepository.softDeleteById(commission.id);
  }
}
