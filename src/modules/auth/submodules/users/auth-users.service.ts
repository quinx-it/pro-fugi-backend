import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { AuthCustomerRolesService } from '@/modules/auth/submodules/roles/submodules/customers/auth-customer-roles.service';
import { IUpdateAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { AuthUsersRepository } from '@/modules/auth/submodules/users/repositories/auth-users.repository';
import {
  IAuthUser,
  IAuthUsersSearchView,
} from '@/modules/auth/submodules/users/types';
import {
  AppException,
  ERROR_MESSAGES,
  IFilter,
  IPaginated,
  IPagination,
  ISort,
  PaginationUtil,
} from '@/shared';

@Injectable()
export class AuthUsersService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repo: AuthUsersRepository,
    private readonly customerRolesService: AuthCustomerRolesService,
  ) {}

  async findManyPaginated(
    filter: IFilter<IAuthUsersSearchView>,
    sort: ISort<IAuthUsersSearchView>,
    pagination: IPagination,
  ): Promise<IPaginated<IAuthUser>> {
    const { items, count } = await this.repo.findManyAndCount(
      filter,
      sort,
      pagination,
    );

    return PaginationUtil.fromSinglePage(items, count, pagination);
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
    const user = throwIfNotFound
      ? await this.repo.findOne(id, true, manager)
      : await this.repo.findOne(id, false, manager);

    return user;
  }

  async createOne(
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthUser> {
    const user = await this.repo.createOne(manager);

    return user;
  }

  async updateOne(
    id: number,
    authCustomerRole?: IUpdateAuthCustomerRole,
  ): Promise<IAuthUser> {
    const { authCustomerRole: userAuthCustomerRole } = await this.repo.findOne(
      id,
      true,
    );

    if (authCustomerRole) {
      if (!userAuthCustomerRole) {
        throw AppException.fromTemplate(ERROR_MESSAGES.NOT_FOUND_TEMPLATE, {
          value: 'Auth customer role',
        });
      }

      const { id: authCustomerRoleId } = userAuthCustomerRole;

      const { address, firstName, lastName } = authCustomerRole;

      await this.customerRolesService.updateOne(
        authCustomerRoleId,
        firstName,
        lastName,
        address,
      );
    }

    const user = await this.repo.findOne(id, true);

    return user;
  }
}
