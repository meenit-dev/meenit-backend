import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CreatorService } from './service/creator.service';
import { CreatorController } from './controller/creator.controller';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [UserModule, TagModule],
  providers: [CreatorService],
  exports: [CreatorService],
  controllers: [CreatorController],
})
export class CreatorModule {}
