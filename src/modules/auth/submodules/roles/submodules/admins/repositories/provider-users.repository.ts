import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { AdminRoleEntity } from '@/modules/auth/submodules/roles/submodules/admins/entities/admin-role.entity';
import { IAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

@Injectable()
export class AdminUsersRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IAdminRole>;

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IAdminRole | null>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAdminRole | null> {
    const providerEntity = await manager.findOne(AdminRoleEntity, {
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
}
