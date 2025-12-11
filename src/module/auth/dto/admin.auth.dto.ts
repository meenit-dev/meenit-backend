import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AdminSignInBodyDto {
  @ApiProperty({
    description: '이메일',
    example: '이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호. 최소 8자',
    example: '비밀번호. 최소 8자',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
