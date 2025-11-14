import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { AuthCustomerRolesRepository } from '@/modules/auth/submodules/roles/submodules/customers/repositories/auth-customer-roles.repository';
import { IAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';

@Injectable()
export class AuthCustomerRolesService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repo: AuthCustomerRolesRepository,
  ) {}

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IAuthCustomerRole>;

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IAuthCustomerRole | null>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthCustomerRole | null> {
    const customerRole = throwIfNotFound
      ? await this.repo.findOne(id, true, manager)
      : await this.repo.findOne(id, false, manager);

    return customerRole;
  }

  async createOne(
    userId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthCustomerRole> {
    const customerRole = await this.repo.createOne(userId, manager);

    return customerRole;
  }

  async updateOne(
    id: number,
    firstName?: string | null,
    lastName?: string | null,
    address?: string | null,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthCustomerRole> {
    const customerRole = await this.repo.updateOne(
      id,
      firstName,
      lastName,
      address,
      manager,
    );

    return customerRole;
  }
}
