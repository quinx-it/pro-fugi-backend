import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { AuthCustomerRoleEntity } from '@/modules/auth/submodules/roles/submodules/customers/entities/auth-customer-role.entity';
import { IAuthCustomerRole } from '@/modules/auth/submodules/roles/submodules/customers/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

@Injectable()
export class AuthCustomerRolesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

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
    const providerEntity = await manager.findOne(AuthCustomerRoleEntity, {
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
  ): Promise<IAuthCustomerRole> {
    const { id } = await manager.save(AuthCustomerRoleEntity, {
      authUserId: userId,
      firstName: null,
    });

    const customerRole = await this.findOne(id, true, manager);

    return customerRole;
  }

  async updateOne(
    id: number,
    firstName?: string | null,
    lastName?: string | null,
    address?: string | null,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthCustomerRole> {
    if (
      firstName !== undefined ||
      lastName !== undefined ||
      address !== undefined
    )
      await manager.update(AuthCustomerRoleEntity, id, {
        firstName,
        lastName,
        address,
      });

    const customerRole = await this.findOne(id, true, manager);

    return customerRole;
  }
}
