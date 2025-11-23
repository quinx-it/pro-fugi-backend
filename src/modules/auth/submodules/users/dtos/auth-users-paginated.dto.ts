import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { AuthUserDto } from '@/modules/auth/submodules/users/dtos/auth-user.dto';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';

export class AuthUsersPaginatedDto extends PaginatedDto<AuthUserDto> {
  @ApiProperty({ type: AuthUserDto, isArray: true })
  @IsArray()
  @Type(() => AuthUserDto)
  @ValidateNested({ each: true })
  items!: AuthUserDto[];
}
