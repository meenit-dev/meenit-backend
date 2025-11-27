import { ApiProperty } from '@nestjs/swagger';
import { Resource } from 'src/module/storage/entity/resource.entity';
import { ResourceProvider } from 'src/module/storage/type/resource.type';

export class ResourceDto {
  @ApiProperty({
    description: '파일 경로',
    example: 'https://meenit.co/file',
  })
  url: string;

  @ApiProperty({
    description: 'contentType',
    example: 'image/jpeg',
  })
  contentType: string;

  constructor(resource: Resource) {
    this.url = this.makeUrl(resource);
    this.contentType = resource.contentType;
  }

  makeUrl(resource: Resource) {
    switch (resource.provider) {
      case ResourceProvider.YOUTUBE:
        return `https://youtu.be/${resource.key}`;
      case ResourceProvider.MEENIT:
        return `${process.env.R2_RESOURCE_URL}/${resource.key}`;
    }
  }
}
