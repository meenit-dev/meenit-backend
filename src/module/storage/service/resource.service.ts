import { Injectable } from '@nestjs/common';
import { DEFAULT_STORAGE_SIZE, StorageType } from '../type/storage.type';
import { ResourceRepository } from '../repository/storage.repository';
import { Resource } from '../entity/resource.entity';
import { StorageService } from './storage.service';
import { ResourceProvider } from '../type/resource.type';
import { BadRequestError } from '@common/error';
import { UserPayload } from 'src/module/auth/type/auth.type';
import { PutPreSignedUrlBodyDto } from '../dto/storage.dto';
import { UUID } from '@common/type';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ResourceService {
  private readonly MEENIT_RESOURCE_BASE_URL = process.env.R2_RESOURCE_URL;

  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly storageService: StorageService,
  ) {}

  async getUserStorageInfo(userId: UUID) {
    const { usedSize, fileCount } =
      await this.resourceRepository.findPortfolioResourceSizeAndCountByUserId(
        userId,
      );

    return {
      totalSize: DEFAULT_STORAGE_SIZE,
      usedSize,
      fileCount,
    };
  }

  @Transactional()
  async getResourceTicket(
    user: UserPayload,
    { type, mimeType, extention, contentLength }: PutPreSignedUrlBodyDto,
  ) {
    const ticket = await this.storageService.getPutPreSignedUrl(
      user,
      type,
      mimeType,
      extention,
      contentLength,
    );
    await this.upsertResource(user.id, type, ticket.publicUrl, {
      contentType: mimeType,
      size: contentLength,
    });
    await this.checkResourceUploaded(user.id);
    return ticket;
  }

  async checkResourceUploaded(userId: UUID) {
    const resources =
      await this.resourceRepository.findNotUploadedByUserId(userId);
    await Promise.all(
      resources.map(async (resource) => {
        if (await this.storageService.getHeadObject(resource.key)) {
          await this.resourceRepository.save(resource.toUploaded());
        } else {
          await this.resourceRepository.softDeleteById(resource.id);
        }
      }),
    );
  }

  getProviderByUrl(url: string) {
    if (url.startsWith(this.MEENIT_RESOURCE_BASE_URL)) {
      return ResourceProvider.MEENIT;
    } else if (
      url.startsWith('https://youtube.com') ||
      url.startsWith('https://youtu.be')
    ) {
      return ResourceProvider.YOUTUBE;
    }
  }

  getKeyByProviderAndUrl(provider: ResourceProvider, url: string) {
    switch (provider) {
      case ResourceProvider.YOUTUBE:
        return (url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/) ||
          url.match(/[?&]v=([A-Za-z0-9_-]{6,})/) ||
          url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/))?.[1];
      case ResourceProvider.MEENIT:
        return url.split('.co/')[1];
    }
  }

  async upsertResource(
    userId: UUID,
    type: StorageType,
    url: string,
    metadata: {
      contentType: string;
      size: number;
    } = { contentType: 'video/*', size: 0 },
  ) {
    const provider = this.getProviderByUrl(url);
    if (!provider) {
      return;
    }
    const key = this.getKeyByProviderAndUrl(provider, url);
    if (!key) {
      throw new BadRequestError();
    }
    const resource = await this.resourceRepository.findOneByProviderAndKey(
      provider,
      key,
    );
    if (resource) {
      return resource;
    }
    return this.resourceRepository.save(
      Resource.of({
        userId,
        provider,
        type,
        contentType: metadata.contentType,
        size: metadata.size,
        key,
      }),
    );
  }

  async deleteResourceByUrl(url: string) {
    if (!url) {
      return;
    }
    const provider = this.getProviderByUrl(url);
    const key = this.getKeyByProviderAndUrl(provider, url);
    return this.resourceRepository.softDeleteByProviderAndKey(provider, key);
  }

  async deleteResourceById(id: UUID) {
    return this.resourceRepository.softDeleteById(id);
  }
}
