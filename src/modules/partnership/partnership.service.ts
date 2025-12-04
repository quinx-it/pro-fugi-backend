import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { PartnershipLettersRepository } from '@/modules/partnership/repositories/partnership-letters.repository';
import { IPartnershipLetter } from '@/modules/partnership/types';
import { DbUtil, IPaginated, IPagination, PaginationUtil } from '@/shared';

@Injectable()
export class PartnershipService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repo: PartnershipLettersRepository,
  ) {}

  async findManyLettersPaginated(
    pagination: IPagination,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IPaginated<IPartnershipLetter>> {
    const { items, count } = await this.repo.findManyAndCount(
      pagination,
      manager,
    );

    return PaginationUtil.fromSinglePage(items, count, pagination);
  }

  async findOneLetter(
    id: number,
    throwIfNotFound?: true,
    manager?: EntityManager,
  ): Promise<IPartnershipLetter>;

  async findOneLetter(
    id: number,
    throwIfNotFound?: false,
    manager?: EntityManager,
  ): Promise<IPartnershipLetter | null>;

  async findOneLetter(
    id: number,
    throwIfNotFound: boolean = true,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IPartnershipLetter | null> {
    const partnershipLetter = throwIfNotFound
      ? await this.repo.findOne(id, true, manager)
      : await this.repo.findOne(id, false, manager);

    return partnershipLetter;
  }

  async createOneLetter(
    phone: string,
    text: string,
    manager: EntityManager | null = null,
  ): Promise<IPartnershipLetter> {
    return DbUtil.transaction(
      async (transactionManager) =>
        this.repo.createOne(phone, text, false, transactionManager),
      this.dataSource,
      manager,
    );
  }

  async updateOneLetter(
    id: number,
    isRead: boolean,
    manager: EntityManager | null = null,
  ): Promise<IPartnershipLetter> {
    return DbUtil.transaction(
      async (transactionManager) =>
        this.repo.updateOne(
          id,
          undefined,
          undefined,
          isRead,
          transactionManager,
        ),
      this.dataSource,
      manager,
    );
  }
}
