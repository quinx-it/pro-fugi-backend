import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { UpdateAuthCustomerRoleDto } from '@/modules/auth/submodules/roles/submodules/customers/dtos/update-auth-customer-role.dto';
import { IUpdateAuthUser } from '@/modules/auth/submodules/users/types';

export class UpdateAuthUserDto implements IUpdateAuthUser {
  @ApiProperty({ type: UpdateAuthCustomerRoleDto })
  @IsOptional()
  @Type(() => UpdateAuthCustomerRoleDto)
  @ValidateNested()
  authCustomerRole?: UpdateAuthCustomerRoleDto;
}
