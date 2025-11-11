import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { StorageType } from '../type/storage.type';

export class PostPreSignedUrlBodyDto {
  @ApiProperty({
    description: '발급할 파일의 종류',
    example: StorageType.COMMISSION,
    enum: StorageType,
  })
  @IsEnum(StorageType)
  type: StorageType;

  @ApiProperty({
    description: '미디어 타입',
    example: 'image/jpeg',
  })
  @IsString()
  mimeType: string;

  @ApiProperty({
    description: '파일 확장자',
    example: 'jpeg',
  })
  @IsString()
  extention: string;
}
