import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entity/portfolio.entity';
import { PortfolioService } from './service/portfolio.service';
import { PortfolioRepository } from './repository/portfolio.repository';
import { PortfolioController } from './controller/portfolio.controller';
import { UserModule } from '../user/user.module';
import { PortfolioLikeRepository } from './repository/portfolio.like.repository';
import { PortfolioLike } from './entity/portfolio.like.entity';
import { PortfolioTag } from './entity/portfolio.tag.entity';
import { PortfolioTagRepository } from './repository/portfolio.tag.repository';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio, PortfolioLike, PortfolioTag]),
    UserModule,
    TagModule,
  ],
  providers: [
    PortfolioService,
    PortfolioRepository,
    PortfolioLikeRepository,
    PortfolioTagRepository,
  ],
  controllers: [PortfolioController],
  exports: [PortfolioService],
})
export class PortfolioModule {}
