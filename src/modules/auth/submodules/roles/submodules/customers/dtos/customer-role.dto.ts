import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsString, ValidateIf } from 'class-validator';

import { ICustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';

export class CustomerRoleDto implements ICustomerRole {
  @Exclude()
  id!: number;

  @Exclude()
  userId!: number;

  @Exclude()
  createdAt!: Date;

  @ApiProperty()
  @ValidateIf(({ name }) => name !== null)
  @IsString()
  name!: string | null;
}
