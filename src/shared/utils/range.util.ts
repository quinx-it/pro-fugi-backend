import { IRange } from '@/shared';

export class RangeUtil {
  static fromValue<T>(value: T): IRange<T> {
    return { min: value, max: value };
  }

  static fromValueOrPartialRange<T>(
    valueOrRange: T | Partial<IRange<T>>,
  ): Partial<IRange<T>> {
    if (typeof valueOrRange === 'object') {
      return valueOrRange as Partial<IRange<T>>;
    }

    return RangeUtil.fromValue(valueOrRange);
  }

  static fromValueOrRange<T>(valueOrRange: T | IRange<T>): IRange<T> {
    if (typeof valueOrRange === 'object') {
      return valueOrRange as IRange<T>;
    }

    return RangeUtil.fromValue(valueOrRange);
  }

  static isRange(object: unknown): boolean {
    if (typeof object !== 'object') {
      return false;
    }

    const keys = Object.keys(object as object);

    const { length } = keys;

    const hasMin = keys.includes('min');
    const hasMax = keys.includes('max');

    if (!hasMin && !hasMax) {
      return false;
    }

    const minMaxLength = Number(hasMin) + Number(hasMax);

    return length === minMaxLength;
  }

  static getFlattened(object: object): object;

  static getFlattened(object: object[]): object[];

  static getFlattened(object: object | object[]): object | object[] {
    if (Array.isArray(object)) {
      return object.map((item) => RangeUtil.getFlattened(item));
    }

    const entries: [string, unknown][] = [];

    Object.entries(object).forEach(([key, value]) => {
      const isRange = RangeUtil.isRange(value);

      if (isRange) {
        const { min, max } = value as IRange<unknown>;

        entries.push([`${key}Min`, min]);
        entries.push([`${key}Max`, max]);
      } else {
        entries.push([key, value]);
      }
    });

    const flattenedObject = Object.fromEntries(entries);

    return flattenedObject;
  }
}
