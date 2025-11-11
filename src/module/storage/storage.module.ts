import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { STORAGE_PROVIDER } from './type/storage.type';
import { StorageController } from './controller/storage.controller';
import { StorageService } from './service/storage.service';

@Module({
  providers: [
    {
      provide: STORAGE_PROVIDER,
      useFactory: () => {
        console.log({
          region: process.env.NCP_REGION,
          credentials: {
            accessKeyId: process.env.NCP_ACCESS_KEY,
            secretAccessKey: process.env.NCP_SECRET_KEY,
          },
          endpoint: process.env.NCP_ENDPOINT,
          forcePathStyle: true,
        });
        return new S3Client({
          region: process.env.NCP_REGION,
          credentials: {
            accessKeyId: process.env.NCP_ACCESS_KEY,
            secretAccessKey: process.env.NCP_SECRET_KEY,
          },
          endpoint: process.env.NCP_ENDPOINT,
          forcePathStyle: true,
        });
      },
    },
    StorageService,
  ],
  exports: [STORAGE_PROVIDER],
  controllers: [StorageController],
})
export class StorageModule {}
