import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { ICreateAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class CreateAuthCustomerRoleDto implements ICreateAuthCustomerRole {
  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  address!: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  firstName!: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  lastName!: string | null;
}
