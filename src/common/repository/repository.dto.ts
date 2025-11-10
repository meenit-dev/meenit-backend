export interface PaginationResponseDto<T> {
  list: T[];
  totalCount: number;
}
