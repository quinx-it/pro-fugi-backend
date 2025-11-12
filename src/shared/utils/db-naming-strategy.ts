import pluralize from 'pluralize';
import { NamingStrategyInterface, Table } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class DbNamingStrategy
  extends SnakeNamingStrategy
  implements NamingStrategyInterface
{
  tableName(className: string, customName?: string): string {
    if (customName) {
      return customName;
    }

    const singularName = className.replace('Entity', '');
    const pluralizedName = pluralize(singularName);

    return snakeCase(pluralizedName);
  }

  joinTableName(firstTableName: string, secondTableName: string): string {
    const firstPlural = pluralize(snakeCase(firstTableName));
    const secondPlural = pluralize(snakeCase(secondTableName));

    return `${firstPlural}_of_${secondPlural}`;
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    const baseName = snakeCase(pluralize.singular(tableName || propertyName));

    return `${baseName}_id`;
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  foreignKeyName(tableOrName: string | Table, columnNames: string[]): string {
    const tableName =
      tableOrName instanceof Table ? tableOrName.name : tableOrName;

    const name = `FK_${snakeCase(tableName)}_${columnNames
      .map((columnName) => snakeCase(columnName))
      .join('_')}`;

    return name;
  }

  primaryKeyName(tableOrName: string | Table, columnNames: string[]): string {
    const tableName =
      tableOrName instanceof Table ? tableOrName.name : tableOrName;

    const name = `PK_${snakeCase(tableName)}_${columnNames
      .map((columnName) => snakeCase(columnName))
      .join('_')}`;

    return name;
  }

  uniqueConstraintName(
    tableOrName: string | Table,
    columnNames: string[],
  ): string {
    const tableName =
      tableOrName instanceof Table ? tableOrName.name : tableOrName;

    const name = `UQ_${snakeCase(tableName)}_${columnNames
      .map((columnName) => snakeCase(columnName))
      .join('_')}`;

    return name;
  }

  relationConstraintName(
    tableOrName: string | Table,
    columnNames: string[],
  ): string {
    const tableName =
      tableOrName instanceof Table ? tableOrName.name : tableOrName;

    const name = `REL_${snakeCase(tableName)}_${columnNames
      .map((columnName) => snakeCase(columnName))
      .join('_')}`;

    return name;
  }

  indexName(tableOrName: string | Table, columnNames: string[]): string {
    const tableName =
      tableOrName instanceof Table ? tableOrName.name : tableOrName;

    const name = `IDX_${snakeCase(tableName)}_${columnNames
      .map((columnName) => snakeCase(columnName))
      .join('_')}`;

    return name;
  }

  static prettifyName(
    tableName: string,
    fromCapital: boolean = true,
    plural: boolean = false,
  ): string {
    const tableNamePrettified = tableName
      .replace('Model', '')
      .split(/(?=[A-Z])/)
      .map((item) => item.toLowerCase())
      .join(' ');

    if (!fromCapital) {
      return `${tableNamePrettified}${plural ? 's' : ''}`;
    }

    return `${
      tableNamePrettified.charAt(0).toUpperCase() + tableNamePrettified.slice(1)
    }${plural ? 's' : ''}`;
  }
}
