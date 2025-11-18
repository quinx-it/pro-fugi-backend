import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AdminRoleAuthGuard } from '@/modules/auth/submodules/roles/submodules/admins/guards';
import { AccessTokenAuthGuard } from '@/modules/auth/submodules/tokens/guards/access-token-auth.guard';
import { PartnershipEndPoint } from '@/modules/partnership/constants';
import {
  CreatePartnershipLetterDto,
  PartnershipLetterDto,
  PartnershipLettersPaginatedDto,
  UpdatePartnershipLetterDto,
} from '@/modules/partnership/dtos';
import { PartnershipService } from '@/modules/partnership/partnership.service';
import { PaginationDto } from '@/shared/dtos/pagination.dto';

@Controller()
@ApiTags(PartnershipEndPoint.API_TAG)
export class PartnershipController {
  constructor(private readonly service: PartnershipService) {}

  @ApiResponse({
    type: PartnershipLettersPaginatedDto,
    status: HttpStatus.OK,
  })
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Get(PartnershipEndPoint.LETTERS)
  async findManyLetters(
    @Query() query: PaginationDto,
  ): Promise<PartnershipLettersPaginatedDto> {
    const partnershipLetters = await this.service.findManyLettersPaginated(
      query,
    );

    return plainToInstance(PartnershipLettersPaginatedDto, partnershipLetters);
  }

  @ApiResponse({ type: PartnershipLetterDto, status: HttpStatus.OK })
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @ApiBearerAuth()
  @Get(PartnershipEndPoint.LETTER)
  async findOneLetter(
    @Param('partnership_letter_id', ParseIntPipe) partnershipLetterId: number,
  ): Promise<PartnershipLetterDto> {
    const partnershipLetter = await this.service.findOneLetter(
      partnershipLetterId,
      true,
    );

    return plainToInstance(PartnershipLetterDto, partnershipLetter);
  }

  @ApiResponse({ type: PartnershipLetterDto, status: HttpStatus.CREATED })
  @Post(PartnershipEndPoint.LETTERS)
  async createOneLetter(
    @Body() body: CreatePartnershipLetterDto,
  ): Promise<PartnershipLetterDto> {
    const { phone, text } = body;

    const partnershipLetter = await this.service.createOneLetter(phone, text);

    return plainToInstance(PartnershipLetterDto, partnershipLetter);
  }

  @ApiResponse({ type: PartnershipLetterDto, status: HttpStatus.CREATED })
  @ApiBearerAuth()
  @UseGuards(AdminRoleAuthGuard)
  @UseGuards(AccessTokenAuthGuard.REQUIRED)
  @Patch(PartnershipEndPoint.LETTER)
  async updateOneLetter(
    @Param('partnership_letter_id', ParseIntPipe) partnershipLetterId: number,
    @Body() body: UpdatePartnershipLetterDto,
  ): Promise<PartnershipLetterDto> {
    const { isRead } = body;

    const partnershipLetter = await this.service.updateOneLetter(
      partnershipLetterId,
      isRead,
    );

    return plainToInstance(PartnershipLetterDto, partnershipLetter);
  }
}
