import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';

import { AuthCustomerRoleAddressDto } from '@/modules/auth/submodules/roles/submodules/customers/dtos/auth-customer-role-address.dto';
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

  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  firstName!: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  lastName!: string | null;

  @ApiProperty({ type: AuthCustomerRoleAddressDto, nullable: true })
  @DtosUtil.isNullable()
  @Type(() => AuthCustomerRoleAddressDto)
  @ValidateNested()
  address?: AuthCustomerRoleAddressDto | null;

  @Exclude()
  productOrders!: IProductOrder[];
}
