import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { UsersRepository } from '@/modules/auth/submodules/users/repositories/users.repository';
import { IUser } from '@/modules/auth/submodules/users/types';

@Injectable()
export class AuthUsersService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly repo: UsersRepository,
  ) {}

  async findOne(
    id: number,
    throwIfNotFound: false,
    manager?: EntityManager,
  ): Promise<IUser | null>;

  async findOne(
    id: number,
    throwIfNotFound: true,
    manager?: EntityManager,
  ): Promise<IUser>;

  async findOne(
    id: number,
    throwIfNotFound: boolean,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IUser | null> {
    const user = throwIfNotFound
      ? await this.repo.findOne(id, true, manager)
      : await this.repo.findOne(id, false, manager);

    return user;
  }

  async createOne(
    manager: EntityManager = this.dataSource.manager,
  ): Promise<IUser> {
    const user = await this.repo.createOne(manager);

    return user;
  }
}
