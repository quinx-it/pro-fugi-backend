import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { AuthUserEntity } from '@/modules/auth/submodules/users/entities';
import { IAuthUser } from '@/modules/auth/submodules/users/types';
import { AuthUsersUtil } from '@/modules/auth/submodules/users/utils';
import { AppException, ERROR_MESSAGES } from '@/shared';

@Injectable()
export class AuthUsersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IAuthUser | null>;

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IAuthUser>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthUser | null> {
    const user = await manager.findOne(AuthUserEntity, {
      where: { id },
      relations: [
        'authAdminRole',
        'authCustomerRole',
        'authCustomerRole.address',
        'authPhoneMethods',
      ],
    });

    if (!user && throwIfNotFound) {
      throw AppException.fromTemplate(ERROR_MESSAGES.NOT_FOUND_TEMPLATE, {
        value: 'User',
      });
    }

    return user ? AuthUsersUtil.toPlain(user) : null;
  }

  async createOne(
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthUser> {
    const { id: userId } = await manager.save(
      AuthUserEntity,
      manager.create(AuthUserEntity, {}),
    );

    const user = await this.findOne(userId, true, manager);

    return AuthUsersUtil.toPlain(user);
  }
}
