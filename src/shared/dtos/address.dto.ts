import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IAddress } from '@/shared';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class AddressDto implements IAddress {
  @ApiProperty()
  @IsString()
  city!: string;

  @ApiProperty()
  @IsString()
  street!: string;

  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  apartment!: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  @DtosUtil.isNullable()
  @IsString()
  block!: string | null;

  @ApiProperty()
  @IsString()
  building!: string;
}
