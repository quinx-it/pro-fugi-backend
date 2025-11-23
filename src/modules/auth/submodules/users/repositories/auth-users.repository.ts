import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, In } from 'typeorm';

import {
  AuthUserEntity,
  AuthUsersSearchViewEntity,
} from '@/modules/auth/submodules/users/entities';
import {
  IAuthUser,
  IAuthUsersSearchView,
} from '@/modules/auth/submodules/users/types';
import { AuthUsersUtil } from '@/modules/auth/submodules/users/utils';
import {
  AppException,
  DbUtil,
  ERROR_MESSAGES,
  IFilter,
  IPagination,
  ISort,
} from '@/shared';

@Injectable()
export class AuthUsersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findManyAndCount(
    filter: IFilter<IAuthUsersSearchView>,
    sort: ISort<IAuthUsersSearchView>,
    pagination: IPagination,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<{ items: IAuthUser[]; count: number }> {
    const where = DbUtil.filterToFindOptionsWhere(filter);
    const order = DbUtil.sortToFindOptionsOrder(sort);
    const { take, skip } = DbUtil.paginationToTakeAndSkip(pagination);

    const [searchResults, count] = await manager.findAndCount(
      AuthUsersSearchViewEntity,
      {
        where,
        order,
        take,
        skip,
      },
    );

    const ids = searchResults.map(({ id }) => id);

    const authUsers = await manager.find(AuthUserEntity, {
      where: { id: In(ids) },
      relations: [
        'authAdminRole',
        'authCustomerRole',
        'authCustomerRole.address',
        'authPhoneMethods',
      ],
    });

    const authUsersMap = new Map(authUsers.map((p) => [p.id, p]));

    const items = ids
      .map((id) => authUsersMap.get(id))
      .filter((authUser): authUser is AuthUserEntity => authUser !== undefined);

    return { items, count };
  }

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
