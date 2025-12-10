import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, Index } from 'typeorm';
import { StorageType } from '../type/storage.type';
import { ResourceProvider } from '../type/resource.type';
import { UUID } from '@common/type';

@Entity({ name: 'resource' })
@Index(['provider', 'key'])
@Index(['userId', 'uploaded'])
export class Resource extends CommonBaseEntity {
  @Column({ name: 'user_id', nullable: false, type: 'uuid' })
  userId: UUID;

  @Column({ nullable: false, type: String })
  type: StorageType;

  @Column({ nullable: false, type: String })
  provider: ResourceProvider;

  @Column({ nullable: false, type: String })
  key: string;

  @Column({ nullable: false, type: Number })
  size: number;

  @Column({ name: 'content_type', nullable: false, type: String })
  contentType: string;

  @Column({ nullable: false, type: Boolean })
  uploaded: boolean;

  static of(createRequest: {
    userId: UUID;
    type: StorageType;
    provider: ResourceProvider;
    key: string;
    size: number;
    contentType: string;
  }) {
    const resource = new Resource();
    resource.userId = createRequest.userId;
    resource.type = createRequest.type;
    resource.provider = createRequest.provider;
    resource.key = createRequest.key;
    resource.size = createRequest.size;
    resource.contentType = createRequest.contentType;
    resource.uploaded = createRequest.provider !== ResourceProvider.MEENIT;
    return resource;
  }

  toUploaded() {
    this.uploaded = true;
    return this;
  }

  makeUrl() {
    switch (this.provider) {
      case ResourceProvider.YOUTUBE:
        return `https://youtu.be/${this.key}`;
      case ResourceProvider.MEENIT:
        return `${process.env.R2_RESOURCE_URL}/${this.key}`;
    }
  }
}
