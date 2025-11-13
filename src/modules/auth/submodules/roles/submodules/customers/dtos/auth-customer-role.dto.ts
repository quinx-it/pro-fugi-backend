import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsInt, IsString, ValidateIf } from 'class-validator';

import { IAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { IProductOrder } from '@/modules/products/submodules/orders/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class AuthCustomerRoleDto implements IAuthCustomerRole {
  @ApiProperty()
  @IsInt()
  id!: number;

  @Exclude()
  authUserId!: number;

  @Exclude()
  createdAt!: Date;

  @ApiProperty()
  @DtosUtil.isNullable()
  @IsString()
  firstName!: string | null;

  @ApiProperty()
  @DtosUtil.isNullable()
  @IsString()
  lastName!: string | null;

  @ApiProperty()
  @DtosUtil.isNullable()
  @IsString()
  address!: string | null;

  @Exclude()
  productOrders!: IProductOrder[];
}
