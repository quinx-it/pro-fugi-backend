import { IProductItem } from '@/modules/products/submodules/items/types';

export class ProductItemsUtil {
  static toPlain(object: IProductItem): IProductItem {
    return {
      id: object.id,
      name: object.name,
      description: object.description,
      createdAt: object.createdAt,
      updatedAt: object.updatedAt,
      basePrice: object.basePrice,
      discountValue: object.discountValue,
      discountPercentage: object.discountPercentage,
      price: object.price,
      rating: object.rating,
      inStockNumber: object.inStockNumber,
      specification: object.specification,
      productCategory: object.productCategory,
      productCategoryId: object.productCategoryId,
      productGroup: object.productGroup,
      productGroupId: object.productGroupId,
      productImages: object.productImages,
      productReviews: object.productReviews,
      isArchived: object.isArchived,
    };
  }
}
