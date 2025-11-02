import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { CustomerRolesRepository } from '@/modules/auth/submodules/roles/submodules/customers/repositories/customer-roles.repository';
import { ICustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';

@Injectable()
export class AuthCustomerRolesService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repo: CustomerRolesRepository,
  ) {}

  async createOne(
    userId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<ICustomerRole> {
    const customerRole = await this.repo.createOne(userId, manager);

    return customerRole;
  }
}
