export interface IPagination {
  limit: number;
  page: number;
  offset: number;
}

export interface IPaginated<T> extends IPagination {
  totalPagesCount: number;
  totalItemsCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  items: T[];
}
