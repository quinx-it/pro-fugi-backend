import { IPaginated, IPagination } from '@/shared';

export class PaginationUtil {
  static fromSinglePage<T>(
    pageItems: T[],
    totalItemsCount: number,
    pagination: IPagination,
  ): IPaginated<T> {
    const { page, limit, offset } = pagination;

    const totalPagesCount = PaginationUtil.getTotalPagesCount(
      totalItemsCount,
      limit,
      offset,
    );

    const hasNext = PaginationUtil.getHasNext(totalPagesCount, page);

    const hasPrevious = PaginationUtil.getHasPrevious(page);

    return {
      page,
      limit,
      offset,
      totalItemsCount,
      totalPagesCount,
      hasNext,
      hasPrevious,
      items: pageItems,
    };
  }

  static getTotalPagesCount(
    totalItemsCount: number,
    limit: number,
    offset: number,
  ): number {
    return Math.ceil((totalItemsCount - offset) / limit);
  }

  static getHasNext(totalPagesCount: number, page: number): boolean {
    return page < totalPagesCount - 1;
  }

  static getHasPrevious(page: number): boolean {
    return page > 0;
  }
}
