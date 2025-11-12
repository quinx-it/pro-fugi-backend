import { IProductItem } from '@/modules/products/submodules/items/types';

export class ProductItemsUtil {
  static toPlain(object: IProductItem): IProductItem {
    return {
      id: object.id,
      name: object.name,
      description: object.description,
      createdAt: object.createdAt,
      updatedAt: object.updatedAt,
      price: object.price,
      rating: object.rating,
      inStockNumber: object.inStockNumber,
      specification: object.specification,
      productCategory: object.productCategory,
      productCategoryId: object.productCategoryId,
      productImages: object.productImages,
      productPrices: object.productPrices,
      productReviews: object.productReviews,
      isArchived: object.isArchived,
    };
  }
}
