import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { UserEntity } from '@/modules/auth/submodules/users/entities';
import { IUser } from '@/modules/auth/submodules/users/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IUser | null>;

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IUser>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IUser | null> {
    const user = await manager.findOne(UserEntity, {
      where: { id },
      relations: ['adminRole', 'customerRole'],
    });

    if (!user && throwIfNotFound) {
      throw AppException.fromTemplate(ERROR_MESSAGES.NOT_FOUND_TEMPLATE, {
        value: 'User',
      });
    }

    return user;
  }

  async createOne(
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IUser> {
    const user = await manager.save(UserEntity, manager.create(UserEntity, {}));

    return user;
  }
}
