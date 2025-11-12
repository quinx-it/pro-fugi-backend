import { EntityManager } from 'typeorm';

export interface IRepository<TPlain, TEntity> {
  toPlain(entity: TEntity): TPlain;
  toEntity(plain: TPlain, manager: EntityManager): TEntity;
}

export interface IRange<T> {
  min: T;
  max: T;
}

export interface IIsNullable {
  isNullable: boolean;
}

export interface IFile {
  fileName: string;
}
