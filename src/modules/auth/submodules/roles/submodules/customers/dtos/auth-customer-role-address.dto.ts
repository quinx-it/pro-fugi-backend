import { Exclude } from 'class-transformer';

import {
  IAuthCustomerRoleAddress,
  IAuthCustomerRole,
} from '@/modules/auth/submodules/roles/submodules/customers/types';
import { AddressDto } from '@/shared/dtos/address.dto';

export class AuthCustomerRoleAddressDto
  extends AddressDto
  implements IAuthCustomerRoleAddress
{
  @Exclude()
  id!: number;

  @Exclude()
  authCustomerRole?: IAuthCustomerRole;

  @Exclude()
  authCustomerRoleId!: number;
}
