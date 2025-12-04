import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { AuthAdminRolesRepository } from '@/modules/auth/submodules/roles/submodules/admins/repositories';
import { IAuthAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';
import { AppException, DbUtil, ERROR_MESSAGES } from '@/shared';

@Injectable()
export class AuthAdminRolesService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repo: AuthAdminRolesRepository,
  ) {}

  async createOne(
    authUserId: number,
    name: string,
    manager: EntityManager | null = null,
  ): Promise<IAuthAdminRole> {
    return DbUtil.transaction(
      async (transactionManager) => {
        const existingAdminRole = await this.repo.findOneByUserId(
          authUserId,
          false,
          transactionManager,
        );

        if (existingAdminRole) {
          throw AppException.fromTemplate(
            ERROR_MESSAGES.ALREADY_EXISTS_TEMPLATE,
            {
              value: 'Auth admin role',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        const authAdminRole = await this.repo.createOne(
          authUserId,
          name,
          transactionManager,
        );

        return authAdminRole;
      },
      this.dataSource,
      manager,
    );
  }

  async updateOne(authUserId: number, name?: string): Promise<IAuthAdminRole> {
    const { id: authAdminRoleId } = await this.repo.findOneByUserId(
      authUserId,
      true,
    );

    const authAdminRole = await this.repo.updateOne(authAdminRoleId, name);

    return authAdminRole;
  }

  async destroyOne(authUserId: number): Promise<void> {
    const { id: authAdminRoleId } = await this.repo.findOneByUserId(
      authUserId,
      true,
    );

    await this.repo.destroyOne(authAdminRoleId);
  }
}
