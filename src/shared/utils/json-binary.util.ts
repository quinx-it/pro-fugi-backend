import { Raw } from 'typeorm';

const SUFFIX_MAP: Record<string, (path: string, param: string) => string> = {
  Min: (p, param) => `((${p})::numeric >= ${param})`,
  Max: (p, param) => `((${p})::numeric <= ${param})`,
  Gt: (p, param) => `((${p})::numeric > ${param})`,
  Gte: (p, param) => `((${p})::numeric >= ${param})`,
  Lt: (p, param) => `((${p})::numeric < ${param})`,
  Lte: (p, param) => `((${p})::numeric <= ${param})`,
};

export class JsonBinaryUtil {
  static parseJsonbQuery(
    input: Record<string, string | number | string[] | number[]>,
    options: { columnAlias?: string } = {},
  ): unknown {
    const alias = options.columnAlias || 'json_col';

    const conditions: string[] = [];
    const parameters: Record<string, unknown> = {};
    let paramIndex = 0;

    Object.keys(input).forEach((key) => {
      const value = input[key];

      if (value === undefined || value === null) {
        return;
      }

      paramIndex += 1;
      const paramName = `p${paramIndex}`;
      let foundSuffix = false;

      Object.keys(SUFFIX_MAP).forEach((suffix) => {
        const buildExpr = SUFFIX_MAP[suffix];

        if (!key.endsWith(suffix)) {
          return;
        }

        foundSuffix = true;

        const baseKey = key.slice(0, -suffix.length);
        const pathSegments = baseKey.split('.');

        const jsonPath =
          pathSegments.length > 1
            ? `${alias} #>> '{${pathSegments.join(',')}}'`
            : `${alias} ->> '${pathSegments[0]}'`;

        conditions.push(buildExpr(jsonPath, `:${paramName}`));
        parameters[paramName] = value;
      });

      if (foundSuffix) {
        return;
      }

      if (key.endsWith('In')) {
        const baseKey = key.slice(0, -2);
        const pathSegments = baseKey.split('.');

        const jsonPath =
          pathSegments.length > 1
            ? `${alias} #>> '{${pathSegments.join(',')}}'`
            : `${alias} ->> '${pathSegments[0]}'`;

        const arr = Array.isArray(value) ? value : [value];
        parameters[paramName] = arr;

        const isNumericArray = arr.length > 0 && typeof arr[0] === 'number';

        if (isNumericArray) {
          conditions.push(
            `((${jsonPath})::numeric = ANY(:${paramName}::numeric[]))`,
          );
        } else {
          conditions.push(`(${jsonPath} = ANY(:${paramName}::text[]))`);
        }

        return;
      }

      if (key.endsWith('Contains') || key.endsWith('Contain')) {
        const baseKey = key.replace(/Contains?$/, '');
        const pathSegments = baseKey.split('.');

        const jsonPath =
          pathSegments.length > 1
            ? `${alias} #>> '{${pathSegments.join(',')}}'`
            : `${alias} ->> '${pathSegments[0]}'`;

        const subConditions: string[] = [];

        if (Array.isArray(value)) {
          value.forEach((v, i) => {
            const subParamName = `${paramName}_${i}`;
            subConditions.push(`${jsonPath} ILIKE :${subParamName}`);
            parameters[subParamName] = `%${v}%`;
          });
        } else {
          subConditions.push(`${jsonPath} ILIKE :${paramName}`);
          parameters[paramName] = `%${value}%`;
        }

        if (subConditions.length > 0) {
          conditions.push(`(${subConditions.join(' OR ')})`);
        }

        return;
      }

      const pathSegments = key.split('.');
      const jsonPath =
        pathSegments.length > 1
          ? `${alias} #>> '{${pathSegments.join(',')}}'`
          : `${alias} ->> '${pathSegments[0]}'`;

      conditions.push(`${jsonPath} = :${paramName}`);
      parameters[paramName] = String(value);
    });

    const sql = conditions.length > 0 ? conditions.join(' AND ') : 'TRUE';

    return Raw(() => sql, parameters);
  }
}
