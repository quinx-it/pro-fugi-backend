import Decimal from 'decimal.js';
import { ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
  to(value?: Decimal | null): string | null | undefined {
    if (!value) return value;

    return value.toString();
  }

  from(value?: string | null): Decimal | null | undefined {
    if (typeof value === 'string') {
      return new Decimal(value);
    }

    return value;
  }
}
