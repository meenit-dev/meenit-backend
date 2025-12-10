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
import { SlotRepository } from './repository/slot.repository';
import { Slot } from './entity/slot.entity';
import { SlotService } from './service/slot.service';
import { UserSlotController } from './controller/user.slot.controller';
import { CommissionOption } from './entity/commission.option.entity';
import { CommissionOptionChoice } from './entity/commission.option.choice.entity';
import { CommissionOptionRepository } from './repository/commission.option.repository';
import { CommissionOptionChoiceRepository } from './repository/commission.option.choice.repository';
import { CommissionThumbnailRepository } from './repository/commission.thumbnail.repository';
import { CommissionThumbnail } from './entity/commission.thumbnail.entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Commission,
      CommissionOption,
      CommissionOptionChoice,
      CommissionThumbnail,
      CommissionTag,
      Slot,
    ]),
    UserModule,
    TagModule,
    StorageModule,
  ],
  providers: [
    CommissionService,
    CommissionRepository,
    CommissionOptionRepository,
    CommissionOptionChoiceRepository,
    CommissionThumbnailRepository,
    CommissionTagRepository,
    SlotRepository,
    SlotService,
  ],
  controllers: [
    CommissionController,
    UserCommissionController,
    UserSlotController,
  ],
  exports: [CommissionService],
})
export class CommissionModule {}
