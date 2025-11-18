import { Injectable } from '@nestjs/common';

import { PartnershipLettersRepository } from '@/modules/partnership/repositories/partnership-letters.repository';
import { IPartnershipLetter } from '@/modules/partnership/types';
import { IPaginated, IPagination, PaginationUtil } from '@/shared';

@Injectable()
export class PartnershipService {
  constructor(private readonly repo: PartnershipLettersRepository) {}

  async findManyLettersPaginated(
    pagination: IPagination,
  ): Promise<IPaginated<IPartnershipLetter>> {
    const { items, count } = await this.repo.findManyAndCount(pagination);

    return PaginationUtil.fromSinglePage(items, count, pagination);
  }

  async findOneLetter(
    id: number,
    throwIfNotFound?: true,
  ): Promise<IPartnershipLetter>;

  async findOneLetter(
    id: number,
    throwIfNotFound?: false,
  ): Promise<IPartnershipLetter | null>;

  async findOneLetter(
    id: number,
    throwIfNotFound: boolean = true,
  ): Promise<IPartnershipLetter | null> {
    const partnershipLetter = throwIfNotFound
      ? await this.repo.findOne(id, true)
      : await this.repo.findOne(id, false);

    return partnershipLetter;
  }

  async createOneLetter(
    phone: string,
    text: string,
  ): Promise<IPartnershipLetter> {
    const partnershipLetter = await this.repo.createOne(phone, text, false);

    return partnershipLetter;
  }

  async updateOneLetter(
    id: number,
    isRead: boolean,
  ): Promise<IPartnershipLetter> {
    const partnershipLetter = await this.repo.updateOne(
      id,
      undefined,
      undefined,
      isRead,
    );

    return partnershipLetter;
  }
}
