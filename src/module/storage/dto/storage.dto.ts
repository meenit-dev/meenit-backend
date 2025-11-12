import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { StorageType } from '../type/storage.type';

export class PutPreSignedUrlBodyDto {
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

  @ApiProperty({
    description: '파일 크기 (byte)',
    example: 92083,
  })
  @IsNumber()
  contentLength: number;
}

export class PutPreSignedUrlResponseDto {
  @ApiProperty({
    description: '업로드할 파일의 Presigned Url',
    example: 'https://meenit.com',
  })
  @IsString()
  presignedUrl: string;

  @ApiProperty({
    description: '업로드 성공 시 조회 가능한 Url',
    example: 'https://meenit.com',
  })
  @IsString()
  publicUrl: string;
}
