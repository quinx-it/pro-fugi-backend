import Decimal from 'decimal.js';

import { FilterSuffix } from '@/shared';

export type IFilter<T> = {
  [K in keyof T]?: T[K] | string;
} & {
  [K in keyof T as
    | `${string & K}${FilterSuffix.MIN}`
    | `${string & K}${FilterSuffix.MAX}`]?: number | Date | Decimal;
} & {
  [K in keyof T as
    | `${string & K}${typeof FilterSuffix.CONTAIN}`
    | `${string & K}${typeof FilterSuffix.CONTAINS}`]?:
    | string[]
    | number[]
    | string;
} & {
  [K in keyof T as `${string & K}${typeof FilterSuffix.IN}`]?:
    | string[]
    | number[];
};
