import { PaginationDto } from '@common/dto';
import { UUID } from '@common/type';
import { PortfolioCategory } from 'src/module/portfolio/type/portfolio.type';

export interface FindCreatorsPagination extends PaginationDto {
  requestUserId?: UUID;
  category?: PortfolioCategory;
  tagIds?: UUID[];
}
