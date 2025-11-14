import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entity/tag.entity';
import { TagService } from './service/tag.service';
import { TagRepository } from './repository/tag.repository';
import { TagController } from './controller/tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagService, TagRepository],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
