import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { AuthAdminRoleEntity } from '@/modules/auth/submodules/roles/submodules/admins/entities/auth-admin-role.entity';
import { IAuthAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

@Injectable()
export class AuthAdminRolesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IAuthAdminRole>;

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IAuthAdminRole | null>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthAdminRole | null> {
    const authAdminRole = await manager.findOne(AuthAdminRoleEntity, {
      where: { id },
    });

    if (!authAdminRole) {
      if (throwIfNotFound) {
        throw AppException.fromTemplate(
          ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
          {
            value: 'Auth admin role',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return null;
    }

    return authAdminRole;
  }
}
