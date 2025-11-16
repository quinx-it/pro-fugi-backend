import {
  IProductOrder,
  IProductOrderItem,
} from '@/modules/products/submodules/orders/types';

export class ProductOrdersUtil {
  static toPlain(object: IProductOrder): IProductOrder {
    return {
      id: object.id,

      authCustomerRole: object.authCustomerRole,
      authCustomerRoleId: object.authCustomerRoleId,

      productOrderItems: object.productOrderItems?.map((productOrderItem) =>
        ProductOrdersUtil.toPlainItem(productOrderItem),
      ),

      address: object.address,
      phone: object.phone,

      status: object.status,
      deliveryType: object.deliveryType,
      comment: object.comment,

      configShippingPrice: object.configShippingPrice,
      configFreeShippingThreshold: object.configFreeShippingThreshold,
      productItemsPrice: object.productItemsPrice,
      deliveryPrice: object.deliveryPrice,
      discountValue: object.discountValue,
      discountPercentage: object.discountPercentage,
      manualPriceAdjustment: object.manualPriceAdjustment,
      totalPrice: object.totalPrice,

      createdAt: object.createdAt,
      updatedAt: object.updatedAt,
    };
  }

  static toPlainItem(object: IProductOrderItem): IProductOrderItem {
    return {
      id: object.id,

      pricePerProductItem: object.pricePerProductItem,
      totalPrice: object.totalPrice,

      productItem: object.productItem,
      productItemId: object.productItemId,

      count: object.count,

      productOrder: object.productOrder,
      productOrderId: object.productOrderId,
    };
  }
}
