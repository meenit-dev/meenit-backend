import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { UUID } from '@common/type';
import { InquiryParamDto } from './inquiry.dto';

export class InquiryAnswerParamDto extends InquiryParamDto {
  @ApiProperty({
    description: '고유 아이디',
    example: 'id',
  })
  @IsUUID()
  answerId: UUID;
}

export class PostInquiryAnswerBodyDto {
  @ApiProperty({
    description: '문의 답변 내용',
    example: '문의 답변 내용',
  })
  @IsString()
  content: string;
}

export class PutInquiryAnswerBodyDto {
  @ApiProperty({
    description: '문의 답변 내용',
    example: '문의 답변 내용',
  })
  @IsString()
  content: string;
}
