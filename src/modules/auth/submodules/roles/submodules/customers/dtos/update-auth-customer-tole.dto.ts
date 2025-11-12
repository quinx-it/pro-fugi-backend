import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { IUpdateAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';

export class UpdateAuthCustomerRoleDto implements IUpdateAuthCustomerRole {
  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName?: string | null;
}
