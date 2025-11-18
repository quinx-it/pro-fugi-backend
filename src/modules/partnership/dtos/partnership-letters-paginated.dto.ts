import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { PartnershipLetterDto } from '@/modules/partnership/dtos/partnership-letter.dto';
import { PaginatedDto } from '@/shared/dtos/paginated.dto';

export class PartnershipLettersPaginatedDto extends PaginatedDto<PartnershipLetterDto> {
  @ApiProperty({ type: PartnershipLetterDto, isArray: true })
  @IsArray()
  @Type(() => PartnershipLetterDto)
  @ValidateNested({ each: true })
  items!: PartnershipLetterDto[];
}
