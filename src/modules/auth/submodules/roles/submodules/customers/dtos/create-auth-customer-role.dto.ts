import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { ICreateAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { AddressDto } from '@/shared/dtos/address.dto';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class CreateAuthCustomerRoleDto implements ICreateAuthCustomerRole {
  @ApiProperty({ type: AddressDto, nullable: true })
  @DtosUtil.isNullable()
  @Type(() => AddressDto)
  @ValidateNested()
  address!: AddressDto | null;

  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  firstName!: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  lastName!: string | null;
}
