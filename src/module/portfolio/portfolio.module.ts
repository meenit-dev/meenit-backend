import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entity/portfolio.entity';
import { PortfolioService } from './service/portfolio.service';
import { PortfolioRepository } from './repository/portfolio.repository';
import { PortfolioController } from './controller/portfolio.controller';
import { UserModule } from '../user/user.module';
import { PortfolioLike } from './entity/portfolio.like.entity';
import { PortfolioLikeRepository } from './repository/portfolio.like.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, PortfolioLike]), UserModule],
  providers: [PortfolioService, PortfolioRepository, PortfolioLikeRepository],
  controllers: [PortfolioController],
  exports: [PortfolioService],
})
export class PortfolioModule {}
