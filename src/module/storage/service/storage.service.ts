import { Inject, Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { STORAGE_PROVIDER, StorageType } from '../type/storage.type';
import { UserPayload } from 'src/module/auth/type/auth.type';
import { v7 } from 'uuid';
import { BadRequestError } from '@common/error';

@Injectable()
export class StorageService {
  constructor(@Inject(STORAGE_PROVIDER) private readonly s3Client) {}

  getStorageFileMeta(user: UserPayload, type: StorageType, extention: string) {
    switch (type) {
      case StorageType.AVATAR:
        return {
          acl: ObjectCannedACL.public_read,
          path: `users/${user.id}/avatar/${v7()}.${extention}`,
          maxSizeBytes: 1048576, // 1MB
        };
      case StorageType.COMMISSION:
        return {
          acl: ObjectCannedACL.public_read,
          path: `users/${user.id}/commission/${v7()}.${extention}`,
          maxSizeBytes: 5242880, //5242880, // 5MB
        };
      case StorageType.PORTFOLIO:
        return {
          acl: ObjectCannedACL.public_read,
          path: `users/${user.id}/portfolio/${v7()}.${extention}`,
          maxSizeBytes: 5242880, // 5MB
        };
      case StorageType.PROFILE_BACKGROUPD:
        return {
          acl: ObjectCannedACL.public_read,
          path: `users/${user.id}/profileBackground/${v7()}.${extention}`,
          maxSizeBytes: 5242880, // 5MB
        };
    }
  }

  async getUploadPostUrl(
    user: UserPayload,
    type: StorageType,
    mimeType: string,
    extention: string,
    contentLength: number,
  ) {
    const bucket = process.env.NCP_BUCKET;
    const { acl, path, maxSizeBytes } = this.getStorageFileMeta(
      user,
      type,
      extention,
    );

    if (contentLength > maxSizeBytes) {
      throw new BadRequestError();
    }
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: path,
      ContentType: mimeType,
      ACL: acl,
      ContentLength: contentLength,
    });

    return {
      presignedUrl: await getSignedUrl(this.s3Client, command, {
        expiresIn: 300,
      }),
      publicUrl: `https://${bucket}.kr.object.ncloudstorage.com/${path}`,
    };
  }

  async getDownloadUrl(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.NCP_BUCKET,
      Key: fileKey,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 10,
    });
  }
}
