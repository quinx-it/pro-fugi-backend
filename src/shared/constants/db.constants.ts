import path from 'path';

import Decimal from 'decimal.js';
import { ColumnOptions } from 'typeorm';

import { DecimalTransformer } from '@/shared/utils';

export enum DbEngine {
  POSTGRES = 'postgres',
}

export const enum SortOrder {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC',
}

export const enum DbType {
  DECIMAL = 'decimal',
  FLOAT = 'float',
  INTEGER = 'integer',
  VARCHAR = 'varchar',
  BOOLEAN = 'boolean',
  TIMESTAMP_TZ = 'timestamp with time zone',
  JSONB = 'jsonb',
}

export const enum RefIntegrityRule {
  CASCADE = 'CASCADE',
  NO_ACTION = 'NO ACTION',
  RESTRICT = 'RESTRICT',
  SET_NULL = 'SET NULL',
  SET_DEFAULT = 'SET DEFAULT',
}

export const TABLE_INHERITANCE_OPTIONS = {
  column: { type: DbType.VARCHAR, name: 'type' },
};

export const MIGRATIONS_PATH = `${
  path.parse(path.parse(__dirname).dir).dir
}/migrations/*.js`;

export const ZERO_STR = '0';

export const DECIMAL_ZERO = new Decimal(ZERO_STR);

export const DECIMAL_COLUMN_OPTIONS: ColumnOptions = {
  type: DbType.DECIMAL,
  precision: 38,
  scale: 18,
  transformer: new DecimalTransformer(),
};
