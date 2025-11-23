import { IsHandle } from '@common/decorator';
import { ApiProperty } from '@nestjs/swagger';

export class UserHandleParamDto {
  @ApiProperty({
    description: 'user 고유 인식 값',
    example: 'Hong1',
  })
  @IsHandle()
  handle: string;
}
