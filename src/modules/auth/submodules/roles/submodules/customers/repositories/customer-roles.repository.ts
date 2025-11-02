import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { CustomerRoleEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities/customer-role.entity';
import { ICustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

@Injectable()
export class CustomerRolesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<ICustomerRole>;

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<ICustomerRole | null>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<ICustomerRole | null> {
    const providerEntity = await manager.findOne(CustomerRoleEntity, {
      where: { id },
    });

    if (!providerEntity) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          {
            value: ERROR_MESSAGES.AUTH_USERS_PROVIDER_ENTITY_NAME,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    return providerEntity;
  }

  async createOne(
    userId: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<ICustomerRole> {
    const customerRole = await manager.save(CustomerRoleEntity, {
      userId,
      name: null,
    });

    return customerRole;
  }
}
