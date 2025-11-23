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

  async findOneByUserId(
    authUserId: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IAuthAdminRole>;

  async findOneByUserId(
    authUserId: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IAuthAdminRole | null>;

  async findOneByUserId(
    authUserId: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthAdminRole | null> {
    const authAdminRole = await manager.findOne(AuthAdminRoleEntity, {
      where: { authUserId },
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

  async createOne(
    authUserId: number,
    name: string,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthAdminRole> {
    const { id } = await manager.save(AuthAdminRoleEntity, {
      authUserId,
      name,
    });

    const authAdminRole = await this.findOne(id, true, manager);

    return authAdminRole;
  }

  async updateOne(
    id: number,
    name?: string,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IAuthAdminRole> {
    if (name !== undefined)
      await manager.update(AuthAdminRoleEntity, id, {
        name,
      });

    const authAdminRole = await this.findOne(id, true, manager);

    return authAdminRole;
  }

  async destroyOne(
    id: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    await manager.delete(AuthAdminRoleEntity, id);
  }
}
