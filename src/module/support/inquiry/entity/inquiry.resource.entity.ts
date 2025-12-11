import { UUID } from '@common/type';
import { CommonBaseEntity } from 'src/common/entity/common-base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Resource } from 'src/module/storage/entity/resource.entity';
import { Inquiry } from './inquiry.entity';

@Entity({ name: 'inquiry_resource' })
export class InquiryResource extends CommonBaseEntity {
  @Column({ name: 'inquiry_id', type: 'uuid' })
  inquiryId: UUID;

  @Column({ name: 'resource_id', type: 'uuid' })
  resourceId: UUID;

  @ManyToOne(() => Inquiry, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'inquiry_id' })
  inquiry: Inquiry;

  @ManyToOne(() => Resource, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'resource_id' })
  resource: Resource;

  static of(createRequest: {
    inquiryId: UUID;
    resourceId: UUID;
  }): InquiryResource {
    const inquiryResource = new InquiryResource();
    inquiryResource.inquiryId = createRequest.inquiryId;
    inquiryResource.resourceId = createRequest.resourceId;
    return inquiryResource;
  }
}
