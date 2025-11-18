import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

import { IUpdateAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { AddressDto } from '@/shared/dtos/address.dto';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class UpdateAuthCustomerRoleDto implements IUpdateAuthCustomerRole {
  @ApiProperty({ type: AddressDto, nullable: true })
  @IsOptional()
  @DtosUtil.isNullable()
  @Type(() => AddressDto)
  @ValidateNested()
  address!: AddressDto | null;

  @ApiProperty({ type: 'string', nullable: true })
  @IsOptional()
  @DtosUtil.isNullable()
  @IsString()
  firstName?: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  @IsOptional()
  @DtosUtil.isNullable()
  @IsString()
  lastName?: string | null;
}
