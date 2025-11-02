import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { IsDate, ValidateIf, ValidateNested } from 'class-validator';

import { IAuthPhoneMethod } from '@/modules/auth/submodules/methods/submodules/phone/types';
import { AdminRoleDto } from '@/modules/auth/submodules/roles/submodules/admins/dtos';
import { CustomerRoleDto } from '@/modules/auth/submodules/roles/submodules/customers/dtos/customer-role.dto';
import { IUser } from '@/modules/auth/submodules/users/types';

export class UserDto implements IUser {
  @Exclude()
  id!: number;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @ValidateIf((obj) => obj.adminRole !== null)
  @Type(() => AdminRoleDto)
  @ValidateNested()
  adminRole!: AdminRoleDto | null;

  @ApiProperty()
  @ValidateIf((obj) => obj.customerRole !== null)
  @Type(() => CustomerRoleDto)
  @ValidateNested()
  customerRole!: CustomerRoleDto | null;

  @Exclude()
  authPhoneMethods!: IAuthPhoneMethod[];
}
