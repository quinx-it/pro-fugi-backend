import { HttpStatus } from '@nestjs/common';
import {
  Between,
  FindOperator,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Like,
  Raw,
} from 'typeorm';

import {
  AppException,
  IFilter,
  IPagination,
  ISort,
  FilterSuffix,
} from '@/shared';
import { ERROR_MESSAGES, SortOrder } from '@/shared/constants';
import { IRange } from '@/shared/types';

export class DbUtil {
  static rangeToFindOperator<T>(
    range: Partial<IRange<T>> | null | undefined,
  ): FindOperator<T> | undefined {
    if (range === null) {
      return IsNull();
    }

    if (range === undefined) {
      return undefined;
    }

    const { min, max } = range;

    if (max === undefined && min === undefined) {
      return undefined;
    }

    if (max !== undefined && min !== undefined) {
      return Between<T>(min, max);
    }

    if (max === undefined && min) {
      return MoreThanOrEqual(min);
    }

    if (max && min === undefined) {
      return LessThanOrEqual(max);
    }

    throw new AppException('Range invalid', HttpStatus.BAD_REQUEST);
  }

  static filterToFindOptionsWhere<T extends object>(
    query: IFilter<T>,
  ): FindOptionsWhere<T> {
    const findOptionsWhere: FindOptionsWhere<T> = {};

    const keys = Object.keys(query).map((key) =>
      key
        .replace(FilterSuffix.MIN, '')
        .replace(FilterSuffix.MAX, '')
        .replace(FilterSuffix.CONTAINS, '')
        .replace(FilterSuffix.CONTAIN, '')
        .replace(FilterSuffix.IN, ''),
    );

    keys.forEach((key) => {
      const value = query[key as keyof IFilter<T>];

      if (value === undefined) {
        const minKey = `${key}${FilterSuffix.MIN}` as keyof IFilter<T>;
        const maxKey = `${key}${FilterSuffix.MAX}` as keyof IFilter<T>;

        const minValue = query[minKey];
        const maxValue = query[maxKey];

        const range = DbUtil.rangeToFindOperator<unknown>({
          min: minValue,
          max: maxValue,
        });

        if (range !== undefined) {
          // @ts-expect-error TODO fix typings
          findOptionsWhere[key as keyof FindOptionsWhere<T>] = range;
        }

        const inKey = `${key}${FilterSuffix.IN}` as keyof IFilter<T>;

        const inValue = query[inKey];

        if (inValue !== undefined) {
          // @ts-expect-error TODO fix typings
          findOptionsWhere[key as keyof FindOptionsWhere<T>] = In(inValue);
        }

        const containKey = `${key}${FilterSuffix.CONTAIN}` as keyof IFilter<T>;
        const containsKey =
          `${key}${FilterSuffix.CONTAINS}` as keyof IFilter<T>;

        const containsValue = query[containKey] || query[containsKey];

        if (containsValue !== undefined) {
          if (Array.isArray(containsValue)) {
            // @ts-expect-error TODO fix typings
            findOptionsWhere[key as keyof FindOptionsWhere<T>] = Raw(
              (col) => `${col} @> :arr`,
              {
                arr: containsValue,
              },
            );
          } else {
            // @ts-expect-error TODO fix typings
            findOptionsWhere[key as keyof FindOptionsWhere<T>] = Like(
              `%${containsValue}%`,
            );
          }
        }
      } else {
        // @ts-expect-error TODO fix typings
        findOptionsWhere[key as keyof FindOptionsWhere<T>] = value;
      }
    });

    return findOptionsWhere;
  }

  static paginationToTakeAndSkip(pagination?: IPagination): {
    take?: number;
    skip?: number;
  } {
    if (!pagination) {
      return { take: undefined, skip: undefined };
    }

    const { page, limit, offset } = pagination;

    const take = limit;

    const skip = page * limit + offset;

    return { take, skip };
  }

  static sortToFindOptionsOrder<T>(sort: ISort<T>): FindOptionsOrder<T> {
    const { descending, sortBy } = sort;

    if (sortBy === undefined) {
      return {};
    }

    const value = descending ? SortOrder.DESCENDING : SortOrder.ASCENDING;

    // @ts-expect-error TODO fix typings
    return { [sortBy]: value };
  }

  static excludeUndefined<T extends object>(object: T | undefined): Partial<T> {
    if (object === undefined) {
      throw new AppException(ERROR_MESSAGES.DB_NO_UPDATE_VALUES_PROVIDED);
    }

    const filteredData = Object.fromEntries(
      Object.entries(object).filter(([, v]) => v !== undefined),
    ) as Partial<T>;

    const hasValues = Object.values(filteredData).length !== 0;

    if (!hasValues) {
      throw new AppException(ERROR_MESSAGES.DB_NO_UPDATE_VALUES_PROVIDED);
    }

    return filteredData;
  }

  static excludeNull<T extends object>(object: T | undefined): Partial<T> {
    if (object === undefined) {
      throw new AppException(ERROR_MESSAGES.DB_NO_UPDATE_VALUES_PROVIDED);
    }

    const filteredData = Object.fromEntries(
      Object.entries(object).filter(([, v]) => v !== null),
    ) as Partial<T>;

    const hasValues = Object.values(filteredData).length !== 0;

    if (!hasValues) {
      throw new AppException(ERROR_MESSAGES.DB_NO_UPDATE_VALUES_PROVIDED);
    }

    return filteredData;
  }

  static selectFields<T extends object>(
    object: T,
    fieldNames: (keyof T)[] | null,
    excludeFields: boolean,
  ): (keyof T)[] {
    let fields = Object.keys(object) as (keyof T)[];

    if (fieldNames) {
      fields = excludeFields
        ? fieldNames
        : fields.filter((item) => fieldNames?.includes(item));
    }

    return fields;
  }

  static hasAnyNotEqualTo<T extends object>(
    object: T,
    fieldNames: (keyof T)[],
    value: unknown,
  ): boolean {
    const hasAny = fieldNames.some((item) => object[item] !== value);

    return hasAny;
  }

  static UNDEFINED_TAKE_AND_SKIP = { take: undefined, skip: undefined };

  static getRelatedEntityOrThrow<
    TEntity extends object,
    TRelatedEntity extends object,
  >(entity: TEntity, relatedEntityName: keyof TEntity): TRelatedEntity {
    const relatedEntity = entity[relatedEntityName];

    if (relatedEntity === undefined) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.DB_CANNOT_GET_RELATED_ENTITY_TEMPLATE,
        { relatedEntityName: relatedEntityName.toString() },
      );
    }

    return relatedEntity as TRelatedEntity;
  }

  static isNoActionRelated(error: unknown): boolean {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return (
        error.message.includes('UPDATE') && error.message.includes('CASCADE')
      );
    }

    return (
      JSON.stringify(error).includes('UPDATE') &&
      JSON.stringify(error).includes('CASCADE')
    );
  }
}
