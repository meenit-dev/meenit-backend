import { Injectable } from '@nestjs/common';
import { PortfolioRepository } from '../repository/portfolio.repository';
import { UUID } from '@common/type';
import { DuplicatedError, ForbiddenError, NotFoundError } from '@common/error';
import { UserService } from 'src/module/user/service/user.service';
import {
  GetPortfoliosQueryDto,
  PatchPortfoliosBodyDto,
  PostPortfoliosBodyDto,
} from '../dto/portfolio.dto';
import { Portfolio } from '../entity/portfolio.entity';
import { Transactional } from 'typeorm-transactional';
import { PortfolioLikeRepository } from '../repository/portfolio.like.repository';
import { PortfolioLike } from '../entity/portfolio.like.entity';
import { TagService } from 'src/module/tag/service/tag.service';
import { PortfolioTag } from '../entity/portfolio.tag.entity';
import { PortfolioTagRepository } from '../repository/portfolio.tag.repository';
import { ResourceService } from 'src/module/storage/service/resource.service';
import { StorageType } from 'src/module/storage/type/storage.type';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly tagService: TagService,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly portfolioLikeRepository: PortfolioLikeRepository,
    private readonly portfolioTagRepository: PortfolioTagRepository,
    private readonly userService: UserService,
    private readonly resourceService: ResourceService,
  ) {}

  @Transactional()
  async createPortfolio(userId: UUID, body: PostPortfoliosBodyDto) {
    const tags = await this.tagService.getTagsByNames(body.tags);
    await this.userService.getUserById(userId);
    const resource = await this.resourceService.uploadedOrCreateOtherResource(
      userId,
      StorageType.PORTFOLIO,
      body.url,
    );
    const portfolio = await this.portfolioRepository.save(
      Portfolio.of({ ...body, userId, resourceId: resource.id }),
    );
    await this.portfolioTagRepository.saveMany(
      tags.map((tag) =>
        PortfolioTag.of({ tagId: tag.id, portfolioId: portfolio.id }),
      ),
    );
    return this.portfolioRepository.findOneWithTagAndResourceAndLikeAndUserById(
      portfolio.id,
    );
  }

  async getPortfoliosPaginationByHandle(
    handle: string,
    requestUserId: UUID | null,
    query: GetPortfoliosQueryDto,
  ) {
    const user = await this.userService.getUserByHandle(handle);
    return this.portfolioRepository.findAllPaginationByUserIdAndCategory(
      user.id,
      query.category,
      requestUserId,
      query,
    );
  }

  async getPortfoliosPagination(
    requestUserId: UUID | null,
    query: GetPortfoliosQueryDto,
  ) {
    return this.portfolioRepository.findAllPaginationByUserIdAndCategory(
      null,
      query.category,
      requestUserId,
      query,
    );
  }

  async getPortfolioById(id: UUID) {
    const portfolio = await this.portfolioRepository.findOneById(id);
    if (!portfolio) {
      throw new NotFoundError();
    }
    return portfolio;
  }

  async getPortfolioAndIncreseViewCountById(id: UUID, requestUserId?: UUID) {
    const portfolio =
      await this.portfolioRepository.findOneWithTagAndResourceAndLikeAndUserById(
        id,
        requestUserId,
      );
    if (!portfolio) {
      throw new NotFoundError();
    }
    await this.portfolioRepository.increseViewCountById(portfolio.id);
    portfolio.viewCount++;
    return portfolio;
  }

  @Transactional()
  async updatePortfolioByIdAndUserId(
    id: UUID,
    userId: UUID,
    updateRequest: PatchPortfoliosBodyDto,
  ) {
    const portfolio = await this.getPortfolioById(id);
    if (portfolio.userId !== userId) {
      throw new ForbiddenError();
    }
    await this.portfolioRepository.save(portfolio.update(updateRequest));
    if (updateRequest.tags) {
      const tags = await this.tagService.getTagsByNames(updateRequest.tags);
      await this.portfolioTagRepository.deleteManyByPortfolioId(portfolio.id);
      await this.portfolioTagRepository.saveMany(
        tags.map((tag) =>
          PortfolioTag.of({ tagId: tag.id, portfolioId: portfolio.id }),
        ),
      );
    }
    return this.portfolioRepository.findOneWithTagAndResourceAndLikeAndUserById(
      id,
    );
  }

  @Transactional()
  async deletePortfolioByIdAndUserId(id: UUID, userId: UUID) {
    const portfolio =
      await this.portfolioRepository.findOneWithTagAndResourceAndLikeAndUserById(
        id,
      );
    if (!portfolio) {
      return;
    }
    if (portfolio.userId !== userId) {
      throw new ForbiddenError();
    }
    await this.portfolioTagRepository.softDeleteByIds(
      portfolio.tags.map((tag) => tag.id),
    );
    await this.resourceService.deleteResourceById(portfolio.resource.id);
    if (portfolio.thumbnailUrl) {
      await this.resourceService.deleteResourceByUrl(portfolio.thumbnailUrl);
    }
    await this.portfolioRepository.softDeleteById(portfolio.id);
  }

  @Transactional()
  async createPortfolioLike(portfolioId: UUID, userId: UUID) {
    const portfolio = await this.getPortfolioById(portfolioId);
    if (
      await this.portfolioLikeRepository.findOneByUserIdAndPortfolioId(
        userId,
        portfolioId,
      )
    ) {
      throw new DuplicatedError();
    }
    await this.portfolioRepository.increseLikeCountById(portfolio.id);
    await this.portfolioLikeRepository.save(
      PortfolioLike.of({
        userId,
        portfolioId,
      }),
    );
  }

  @Transactional()
  async deletePortfolioLike(portfolioId: UUID, userId: UUID) {
    if (
      await this.portfolioLikeRepository.findOneByUserIdAndPortfolioId(
        userId,
        portfolioId,
      )
    ) {
      await this.portfolioRepository.decreseLikeCountById(portfolioId);
    }
    await this.portfolioLikeRepository.deleteByUserIdAndPortfolioId(
      userId,
      portfolioId,
    );
  }
}
