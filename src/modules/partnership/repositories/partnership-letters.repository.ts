import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { PartnershipLetterEntity } from '@/modules/partnership/entities/partnership-letter.entity';
import { IPartnershipLetter } from '@/modules/partnership/types';
import {
  AppException,
  DbUtil,
  ERROR_MESSAGES,
  IPagination,
  SortOrder,
} from '@/shared';

@Injectable()
export class PartnershipLettersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findManyAndCount(
    pagination: IPagination,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<{ items: IPartnershipLetter[]; count: number }> {
    const { take, skip } = DbUtil.paginationToTakeAndSkip(pagination);

    const [items, count] = await manager.findAndCount(PartnershipLetterEntity, {
      take,
      skip,
      order: { createdAt: SortOrder.DESCENDING },
    });

    return { items, count };
  }

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IPartnershipLetter>;

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IPartnershipLetter | null>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IPartnershipLetter | null> {
    const partnershipLetters = await manager.findOne(PartnershipLetterEntity, {
      where: { id },
    });

    if (!partnershipLetters) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          {
            value: 'Partnership form',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    return partnershipLetters;
  }

  async createOne(
    phone: string,
    text: string,
    isRead: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IPartnershipLetter> {
    const partnershipLetter = await manager.save(PartnershipLetterEntity, {
      phone,
      text,
      isRead,
    });

    return partnershipLetter;
  }

  async updateOne(
    id: number,
    phone?: string,
    text?: string,
    isRead?: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IPartnershipLetter> {
    if (phone !== undefined || text !== undefined || isRead !== undefined) {
      await manager.update(PartnershipLetterEntity, id, {
        phone,
        text,
        isRead,
      });
    }

    const partnershipLetter = await this.findOne(id, true, manager);

    return partnershipLetter;
  }
}
