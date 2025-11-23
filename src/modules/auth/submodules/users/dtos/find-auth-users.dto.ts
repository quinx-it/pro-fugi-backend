import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

import { IAuthUsersSearchView } from '@/modules/auth/submodules/users/types';
import { IFilter, IPagination, ISort } from '@/shared';
import { DtosUtil } from '@/shared/utils/dtos.util';

export class FindAuthUsersDto
  implements
    IFilter<IAuthUsersSearchView>,
    ISort<IAuthUsersSearchView>,
    IPagination
{
  @ApiProperty({
    name: 'customer_full_name_contains',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Expose({ name: 'customer_full_name_contains' })
  customerFullNameContains?: string;

  @ApiProperty({
    name: 'customer_address_contains',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Expose({ name: 'customer_address_contains' })
  customerAddressContains?: string;

  @ApiProperty({
    name: 'admin_name_contains',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Expose({ name: 'admin_name_contains' })
  adminNameContains?: string;

  @ApiProperty({
    name: 'phone_contains',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Expose({ name: 'phone_contains' })
  phoneContains?: string;

  @ApiProperty({
    name: 'roles_contain',
    required: false,
    type: String,
  })
  @IsOptional()
  @Transform(DtosUtil.transformCommaSeparatedStringArray)
  @Expose({ name: 'roles_contain' })
  rolesContain?: string[];

  // region Pagination

  @ApiProperty({ name: 'page', example: 0 })
  @Type(() => Number)
  @IsDefined()
  @Expose({ name: 'page' })
  page!: number;

  @ApiProperty({ name: 'limit', example: 15 })
  @Type(() => Number)
  @IsDefined()
  @Expose({ name: 'limit' })
  limit!: number;

  @ApiProperty({ name: 'offset', example: 0 })
  @Type(() => Number)
  @IsDefined()
  @Expose({ name: 'offset' })
  offset!: number;

  // endregion

  // region Sorting

  @ApiProperty({
    name: 'sort_by',
    required: false,
    type: String,
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  @Expose({ name: 'sort_by' })
  sortBy: keyof IAuthUsersSearchView = 'createdAt';

  @ApiProperty({ name: 'descending', required: false })
  @IsOptional()
  @Transform(({ value }) => value === JSON.stringify(true))
  @Expose({ name: 'descending' })
  @IsBoolean()
  descending: boolean = false;

  get pagination(): IPagination {
    const { page, limit, offset } = this;

    return { page, limit, offset };
  }

  get sort(): ISort<IAuthUsersSearchView> {
    const { sortBy, descending } = this;

    return { sortBy, descending };
  }

  get filter(): IFilter<IAuthUsersSearchView> {
    const {
      customerAddressContains,
      customerFullNameContains,
      adminNameContains,
      phoneContains,
      rolesContain,
    } = this;

    return {
      customerAddressContains,
      customerFullNameContains,
      adminNameContains,
      phoneContains,
      rolesContain,
    };
  }
}
