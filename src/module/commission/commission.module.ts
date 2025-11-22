import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commission } from './entity/commission.entity';
import { CommissionService } from './service/commission.service';
import { CommissionRepository } from './repository/commission.repository';
import { CommissionController } from './controller/commission.controller';
import { UserModule } from '../user/user.module';
import { CommissionTag } from './entity/commission.tag.entity';
import { CommissionTagRepository } from './repository/commission.tag.repository';
import { TagModule } from '../tag/tag.module';
import { UserCommissionController } from './controller/user.commission.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commission, CommissionTag]),
    UserModule,
    TagModule,
  ],
  providers: [CommissionService, CommissionRepository, CommissionTagRepository],
  controllers: [CommissionController, UserCommissionController],
  exports: [CommissionService],
})
export class CommissionModule {}
