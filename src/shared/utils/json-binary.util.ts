import { Raw } from 'typeorm';

const SUFFIX_MAP: Record<string, (path: string, param: string) => string> = {
  Min: (p, param) => `((${p})::numeric >= ${param})`,
  Max: (p, param) => `((${p})::numeric <= ${param})`,
  Gt: (p, param) => `((${p})::numeric > ${param})`,
  Gte: (p, param) => `((${p})::numeric >= ${param})`,
  Lt: (p, param) => `((${p})::numeric < ${param})`,
  Lte: (p, param) => `((${p})::numeric <= ${param})`,
  Contains: (p, param) => `${p} @> ${param}`,
};

export class JsonBinaryUtil {
  static parseJsonbQuery(
    input: Record<string, number | string>[],
    options: { columnAlias?: string } = {},
  ): unknown {
    const alias = options.columnAlias || 'json_col';
    const conditions: string[] = [];
    const parameters: Record<string, unknown> = {};
    let paramIndex = 0;

    for (const { name, value } of input) {
      const key = name as string;

      if (value === undefined || value === null) continue;

      const paramName = `p${(paramIndex += 1)}`;
      let foundSuffix = false;

      for (const [suffix, buildExpr] of Object.entries(SUFFIX_MAP)) {
        if (key.endsWith(suffix)) {
          const baseKey = key.slice(0, -suffix.length);

          if (suffix === 'Contains') {
            const containsCondition = `EXISTS (
              SELECT 1 FROM jsonb_array_elements(${alias}) AS attr
              WHERE attr ->> 'name' = '${baseKey}'
              AND jsonb_typeof(attr->'value') = 'array'
              AND (attr->'value')::jsonb @> :${paramName}::jsonb
            )`;
            conditions.push(containsCondition);
            parameters[paramName] = JSON.stringify(
              Array.isArray(value) ? value : [value],
            );
          } else {
            // Исправленный подход для числовых сравнений
            const numericCondition = `EXISTS (
              SELECT 1 FROM jsonb_array_elements(${alias}) AS attr
              WHERE attr ->> 'name' = '${baseKey}'
              AND (attr ->> 'value')::numeric ${this.getOperator(
                suffix,
              )} :${paramName}::numeric
            )`;
            conditions.push(numericCondition);
            parameters[paramName] = value;
          }

          foundSuffix = true;
          break;
        }
      }

      if (!foundSuffix) {
        // Точное совпадение для строковых значений
        const exactMatchCondition = `EXISTS (
          SELECT 1 FROM jsonb_array_elements(${alias}) AS attr
          WHERE attr ->> 'name' = '${key}'
          AND attr ->> 'value' = :${paramName}
        )`;
        conditions.push(exactMatchCondition);
        parameters[paramName] = String(value);
      }
    }

    const sql = conditions.length > 0 ? conditions.join(' AND ') : 'TRUE';

    return conditions.length > 0 ? Raw(() => sql, parameters) : undefined;
  }

  private static getOperator(suffix: string): string {
    const operatorMap: Record<string, string> = {
      Min: '>=',
      Max: '<=',
      Gt: '>',
      Gte: '>=',
      Lt: '<',
      Lte: '<=',
    };

    return operatorMap[suffix] || '=';
  }
}
