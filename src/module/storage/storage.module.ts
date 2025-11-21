import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { STORAGE_PROVIDER } from './type/storage.type';
import { StorageService } from './service/storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entity/resource.entity';
import { ResourceRepository } from './repository/storage.repository';
import { ResourceService } from './service/resource.service';
import { StorageController } from './controller/storage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Resource])],
  providers: [
    {
      provide: STORAGE_PROVIDER,
      useFactory: () => {
        return new S3Client({
          region: process.env.NCP_REGION,
          credentials: {
            accessKeyId: process.env.NCP_ACCESS_KEY,
            secretAccessKey: process.env.NCP_SECRET_KEY,
          },
          endpoint: process.env.NCP_ENDPOINT,
        });
      },
    },
    ResourceRepository,
    StorageService,
    ResourceService,
  ],
  exports: [STORAGE_PROVIDER, ResourceService],
  controllers: [StorageController],
})
export class StorageModule {}
