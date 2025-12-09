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
import { CommissionOptionRepository } from '../repository/commission.option.repository';
import { CommissionOptionChoiceRepository } from '../repository/commission.option.choice.repository';
import { CommissionOption } from '../entity/commission.option.entity';
import { CommissionOptionChoice } from '../entity/commission.option.choice.entity';
import { CommissionOptionType } from '../type/commission.type';
import { UserType } from 'src/module/user/type/user.type';

@Injectable()
export class CommissionService {
  constructor(
    private readonly tagService: TagService,
    private readonly commissionRepository: CommissionRepository,
    private readonly commissionOptionRepository: CommissionOptionRepository,
    private readonly commissionOptionChoiceRepository: CommissionOptionChoiceRepository,
    private readonly commissionTagRepository: CommissionTagRepository,
    private readonly userService: UserService,
  ) {}

  @Transactional()
  async createCommission(userId: UUID, createRequest: PostCommissionBodyDto) {
    const tags = await this.tagService.getTagsByNames(createRequest.tags);
    const user = await this.userService.getUserById(userId);
    if (user.type !== UserType.CREATOR) {
      throw new ForbiddenError();
    }
    const commission = await this.commissionRepository.save(
      Commission.of({ userId, ...createRequest }),
    );
    await this.commissionTagRepository.saveMany(
      tags.map((tag) =>
        CommissionTag.of({ tagId: tag.id, commissionId: commission.id }),
      ),
    );
    for (const i in createRequest.options ?? []) {
      const option = createRequest.options[i];
      const commissionOption = await this.commissionOptionRepository.save(
        CommissionOption.of({
          ...option,
          commissionId: commission.id,
          order: Number(i),
        }),
      );
      if (option.type !== CommissionOptionType.TEXT) {
        await this.commissionOptionChoiceRepository.saveMany(
          option.choices.map(({ label }, i) =>
            CommissionOptionChoice.of({
              label,
              optionId: commissionOption.id,
              order: i,
            }),
          ),
        );
      }
    }
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
    const user = await this.userService.getUserByHandle(handle);
    return this.commissionRepository.findAllWithUserAndTagPaginationByUserIdAndCategory(
      user.id,
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
    if (updateRequest.options) {
      await this.commissionOptionRepository.deleteManyByCommissionId(
        commission.id,
      );
      await this.commissionOptionChoiceRepository.deleteManyByOptionIds(
        commission.options.map(({ id }) => id),
      );
      for (const i in updateRequest.options ?? []) {
        const option = updateRequest.options[i];
        const commissionOption = await this.commissionOptionRepository.save(
          CommissionOption.of({
            ...option,
            commissionId: commission.id,
            order: Number(i),
          }),
        );
        if (option.type !== CommissionOptionType.TEXT) {
          await this.commissionOptionChoiceRepository.saveMany(
            option.choices.map(({ label }, i) =>
              CommissionOptionChoice.of({
                label,
                optionId: commissionOption.id,
                order: i,
              }),
            ),
          );
        }
      }
    }
    return this.commissionRepository.findOneWithTagAndUserById(id);
  }

  @Transactional()
  async deleteCommissionByIdAndUserId(id: UUID, userId: UUID) {
    const commission =
      await this.commissionRepository.findOneWithTagAndUserById(id);
    if (!commission) {
      return;
    }
    if (commission.userId !== userId) {
      throw new ForbiddenError();
    }
    await this.commissionRepository.softDeleteById(commission.id);
    await this.commissionOptionRepository.deleteManyByCommissionId(
      commission.id,
    );
    await this.commissionOptionChoiceRepository.deleteManyByOptionIds(
      commission.options.map(({ id }) => id),
    );
  }
}
