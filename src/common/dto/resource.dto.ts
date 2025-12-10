import { ApiProperty } from '@nestjs/swagger';
import { Resource } from 'src/module/storage/entity/resource.entity';

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
    this.url = resource.makeUrl();
    this.contentType = resource.contentType;
  }
}
