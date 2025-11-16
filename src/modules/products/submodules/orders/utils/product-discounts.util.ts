import {
  ProductDiscountType,
  ProductDiscountValuePostfix,
} from '@/modules/products/submodules/orders/constants';
import {
  IProductCustomerDiscount,
  IProductDiscount,
  IProductDiscountPolicy,
} from '@/modules/products/submodules/orders/types';
import { ERROR_MESSAGES } from '@/shared/constants/error.constants';
import { AppException } from '@/shared/exceptions/app.exception';

export class ProductDiscountsUtil {
  public static toDiscountPolicy(jsonObject: string): IProductDiscountPolicy {
    const map = new Map(
      Object.entries(JSON.parse(jsonObject)).map(([key, value]) => [
        ProductDiscountsUtil.parseFixed(key),
        ProductDiscountsUtil.toDiscount(value),
      ]),
    );

    return map;
  }

  private static parseFixed(value: string): number {
    return parseFloat(
      value.replace(ProductDiscountValuePostfix[ProductDiscountType.FIXED], ''),
    );
  }

  private static parsePercentage(value: string): number {
    return (
      parseFloat(
        value.replace(
          ProductDiscountValuePostfix[ProductDiscountType.PERCENTAGE],
          '',
        ),
      ) * 0.01
    );
  }

  private static toDiscount(value: unknown): IProductDiscount {
    if (typeof value === 'string') {
      if (ProductDiscountValuePostfix[ProductDiscountType.PERCENTAGE]) {
        return {
          value: ProductDiscountsUtil.parsePercentage(value),
          type: ProductDiscountType.PERCENTAGE,
        };
      }

      if (ProductDiscountValuePostfix[ProductDiscountType.FIXED]) {
        return {
          value: ProductDiscountsUtil.parseFixed(value),
          type: ProductDiscountType.FIXED,
        };
      }
    }

    throw AppException.fromTemplate(
      ERROR_MESSAGES.PRODUCT_DISCOUNT_POLICY_INVALID_ENTRY_TEMPLATE,
      { value: JSON.stringify(value) },
    );
  }

  static getOne(
    policy: IProductDiscountPolicy,
    totalOrdersSum: number,
  ): IProductCustomerDiscount {
    const thresholds = Array.from(policy.keys()).sort((a, b) => a - b);

    const currentThreshold =
      thresholds.filter((threshold) => threshold <= totalOrdersSum).at(-1) ??
      null;

    const nextThreshold =
      thresholds.find((threshold) => threshold > totalOrdersSum) ?? null;

    const discount =
      currentThreshold !== null ? policy.get(currentThreshold)! : null;

    return {
      discount,
      totalOrdersSum,
      currentThreshold,
      nextThreshold,
    };
  }

  static getFixedValue(discount: IProductDiscount | null): number | null {
    if (!discount) {
      return null;
    }

    const { value, type } = discount;

    if (type === ProductDiscountType.FIXED) {
      return value;
    }

    return null;
  }

  static getPercentage(discount: IProductDiscount | null): number | null {
    if (!discount) {
      return null;
    }

    const { value, type } = discount;

    if (type === ProductDiscountType.PERCENTAGE) {
      return value;
    }

    return null;
  }
}
