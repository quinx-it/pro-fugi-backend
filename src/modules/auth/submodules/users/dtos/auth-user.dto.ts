import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsDate, ValidateIf, ValidateNested } from 'class-validator';

import { IAuthPhoneMethod } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { AuthAdminRoleDto } from '@/modules/auth/submodules/roles/submodules/admins/dtos';
import { AuthCustomerRoleDto } from '@/modules/auth/submodules/roles/submodules/customers/dtos/auth-customer-role.dto';
import { IAuthUser } from '@/modules/auth/submodules/users/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class AuthUserDto implements IAuthUser {
  @Exclude()
  id!: number;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @DtosUtil.isNullable()
  @Type(() => AuthAdminRoleDto)
  @ValidateNested()
  authAdminRole?: AuthAdminRoleDto | null;

  @ApiProperty()
  @DtosUtil.isNullable()
  @Type(() => AuthCustomerRoleDto)
  @ValidateNested()
  authCustomerRole?: AuthCustomerRoleDto | null;

  @Exclude()
  customerRoleId!: number;

  @Exclude()
  adminRoleId!: number;

  @Exclude()
  authPhoneMethods!: IAuthPhoneMethod[];
}
