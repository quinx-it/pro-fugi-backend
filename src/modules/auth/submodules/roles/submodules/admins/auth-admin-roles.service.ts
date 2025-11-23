import { HttpStatus, Injectable } from '@nestjs/common';

import { AuthAdminRolesRepository } from '@/modules/auth/submodules/roles/submodules/admins/repositories';
import { IAuthAdminRole } from '@/modules/auth/submodules/roles/submodules/admins/types';
import { AppException, ERROR_MESSAGES } from '@/shared';

@Injectable()
export class AuthAdminRolesService {
  constructor(private readonly repo: AuthAdminRolesRepository) {}

  async createOne(authUserId: number, name: string): Promise<IAuthAdminRole> {
    const existingAdminRole = await this.repo.findOneByUserId(
      authUserId,
      false,
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

    const authAdminRole = await this.repo.createOne(authUserId, name);

    return authAdminRole;
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
