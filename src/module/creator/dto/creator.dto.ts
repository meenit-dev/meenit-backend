import { TransArrayQuery } from '@common/decorator/dto.decorator';
import { PaginationDto } from '@common/dto';
import { PaginationResponseDto } from '@common/repository/repository.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PortfolioResponseDto } from 'src/module/portfolio/dto/portfolio.dto';
import { PortfolioCategory } from 'src/module/portfolio/type/portfolio.type';
import { UserResponseDto } from 'src/module/user/dto/user.dto';
import { User } from 'src/module/user/entity/user.entity';

export class GetCreatorsQueryDto extends PaginationDto {
  @ApiProperty({
    description: 'portfolio 카테고리',
    example: PortfolioCategory.WRITING,
    required: false,
    enum: PortfolioCategory,
  })
  @IsOptional()
  @IsEnum(PortfolioCategory)
  category?: PortfolioCategory;

  @ApiProperty({
    description: 'portfolio 태그',
    example: 'SD',
    required: false,
  })
  @IsOptional()
  @TransArrayQuery()
  @IsString({ each: true })
  tags?: string[];
}

export class CreatorResponseDto extends UserResponseDto {
  @ApiProperty({
    description: '리스트',
    type: [PortfolioResponseDto],
  })
  portfolios: PortfolioResponseDto[];

  constructor(user: User) {
    super(user);
    this.portfolios = user.portfolios.map((portfolio) => {
      portfolio.user = user;
      return new PortfolioResponseDto(portfolio);
    });
  }
}

export class GetCreatorsResponseDto extends PaginationResponseDto<CreatorResponseDto> {
  @ApiProperty({
    description: '리스트',
    type: [CreatorResponseDto],
  })
  list: CreatorResponseDto[];

  constructor({ list, totalCount }: PaginationResponseDto<User>) {
    super();
    this.list = list.map((user) => new CreatorResponseDto(user));
    this.totalCount = totalCount;
  }
}
