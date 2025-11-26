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
  presignedUrl: string;

  @ApiProperty({
    description: '업로드 성공 시 조회 가능한 Url',
    example: 'https://meenit.com',
  })
  publicUrl: string;
}

export class GetUserStorageInfoResponseDto {
  @ApiProperty({
    description: '사용가능한 스토리지 사이즈(Byte)',
    example: 100000,
  })
  totalSize: number;

  @ApiProperty({
    description: '사용중인 스토리지 사이즈(Byte)',
    example: 100000,
  })
  usedSize: number;

  @ApiProperty({
    description: '업로드된 파일의 개수',
    example: 10,
  })
  fileCount: number;
}
