import { Injectable } from '@nestjs/common';
import { PortfolioRepository } from '../repository/portfolio.repository';
import { UUID } from '@common/type';
import {
  BadRequestError,
  DuplicatedError,
  ForbiddenError,
  NotFoundError,
} from '@common/error';
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

@Injectable()
export class PortfolioService {
  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly portfolioLikeRepository: PortfolioLikeRepository,
    private readonly userService: UserService,
  ) {}

  async createPortfolio(userId: UUID, body: PostPortfoliosBodyDto) {
    await this.userService.getUserById(userId);
    return this.portfolioRepository.save(Portfolio.of({ userId, ...body }));
  }

  async getPortfoliosPaginationByHandle(
    handle: string,
    query: GetPortfoliosQueryDto,
  ) {
    const user = await this.userService.getUserByHandle(handle);
    return this.portfolioRepository.findAllPaginationByUserIdAndCategory(
      user.id,
      query.category,
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

  async getPortfolioAndIncreseViewCountById(id: UUID) {
    const portfolio = await this.getPortfolioById(id);
    await this.portfolioRepository.increseViewCountById(portfolio.id);
    portfolio.viewCount++;
    return portfolio;
  }

  async updatePortfolioByIdAndUserId(
    id: UUID,
    userId: UUID,
    updateRequest: PatchPortfoliosBodyDto,
  ) {
    const portfolio = await this.getPortfolioById(id);
    if (portfolio.userId !== userId) {
      throw new ForbiddenError();
    }
    return this.portfolioRepository.save(portfolio.update(updateRequest));
  }

  async deletePortfolioByIdAndUserId(id: UUID, userId: UUID) {
    const portfolio = await this.portfolioRepository.findOneById(id);
    if (!portfolio) {
      return;
    }
    if (portfolio.userId !== userId) {
      throw new ForbiddenError();
    }
    await this.portfolioRepository.deleteById(portfolio.id);
  }

  @Transactional()
  async createPortfoliolLike(portfolioId: UUID, userId: UUID) {
    const portfolio = await this.getPortfolioById(portfolioId);
    if (portfolio.userId === userId) {
      throw new BadRequestError();
    }
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
  async deletePortfoliolLike(portfolioId: UUID, userId: UUID) {
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
