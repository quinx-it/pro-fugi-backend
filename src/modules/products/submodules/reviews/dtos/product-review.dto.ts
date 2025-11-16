import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { AuthCustomerRoleDto } from '@/modules/auth/submodules/roles/submodules/customers/dtos/auth-customer-role.dto';
import { IProductItem } from '@/modules/products/submodules/items/types';
import { ProductReviewImageDto } from '@/modules/products/submodules/reviews/dtos/product-review-image.dto';
import { IProductReview } from '@/modules/products/submodules/reviews/types';

export class ProductReviewDto implements IProductReview {
  @ApiProperty()
  @IsInt()
  id!: number;

  @ApiProperty({ type: 'string', nullable: true })
  @ValidateIf((obj) => obj.text !== null)
  @IsString()
  text!: string | null;

  @ApiProperty()
  @IsInt()
  rating!: number;

  @Exclude()
  productItemId!: number;

  @Exclude()
  productItem?: IProductItem;

  @Exclude()
  authCustomerRoleId!: number;

  @ApiProperty()
  @Type(() => AuthCustomerRoleDto)
  @ValidateNested()
  authCustomerRole!: AuthCustomerRoleDto;

  @ApiProperty({ type: ProductReviewImageDto, isArray: true })
  @IsArray()
  @Type(() => ProductReviewImageDto)
  @ValidateNested({ each: true })
  productReviewImages!: ProductReviewImageDto[];
}
