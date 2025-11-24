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

    const buildRawPath = (segments: string[]): string =>
      segments.length > 1
        ? `${alias} #>> '{${segments.join(',')}}'`
        : `${alias} ->> '${segments[0]}'`;

    const buildLowerPath = (segments: string[]): string =>
      `LOWER(${buildRawPath(segments)})`;

    Object.keys(input).forEach((key) => {
      const value = input[key];

      if (value === undefined || value === null) return;

      paramIndex += 1;
      const paramName = `p${paramIndex}`;
      let foundSuffix = false;

      // ---------- NUMERIC SUFFIXES ----------
      Object.keys(SUFFIX_MAP).forEach((suffix) => {
        if (!key.endsWith(suffix)) return;

        foundSuffix = true;
        const buildExpr = SUFFIX_MAP[suffix];

        const baseKey = key.slice(0, -suffix.length);
        const rawPath = buildRawPath(baseKey.split('.'));

        conditions.push(buildExpr(rawPath, `:${paramName}`));
        parameters[paramName] = value;
      });

      if (foundSuffix) return;

      if (key.endsWith('In')) {
        const baseKey = key.slice(0, -2);
        const pathSegments = baseKey.split('.');

        const lowerPath = buildLowerPath(pathSegments);
        const arr = Array.isArray(value) ? value : [value];

        const numeric = arr.length > 0 && typeof arr[0] === 'number';

        if (numeric) {
          parameters[paramName] = arr;
          conditions.push(
            `((${buildRawPath(
              pathSegments,
            )})::numeric = ANY(:${paramName}::numeric[]))`,
          );
        } else {
          parameters[paramName] = arr.map((v) => String(v).toLowerCase());
          conditions.push(`(${lowerPath} = ANY(:${paramName}::text[]))`);
        }

        return;
      }

      if (key.endsWith('Contains') || key.endsWith('Contain')) {
        const baseKey = key.replace(/Contains?$/, '');
        const pathSegments = baseKey.split('.');

        const lowerPath = buildLowerPath(pathSegments);

        const subConditions: string[] = [];

        if (Array.isArray(value)) {
          value.forEach((v, i) => {
            const subParamName = `${paramName}_${i}`;
            subConditions.push(`${lowerPath} ILIKE :${subParamName}`);
            parameters[subParamName] = `%${String(v).toLowerCase()}%`;
          });
        } else {
          subConditions.push(`${lowerPath} ILIKE :${paramName}`);
          parameters[paramName] = `%${String(value).toLowerCase()}%`;
        }

        conditions.push(`(${subConditions.join(' OR ')})`);

        return;
      }

      const pathSegments = key.split('.');
      const lowerPath = buildLowerPath(pathSegments);

      parameters[paramName] = String(value).toLowerCase();
      conditions.push(`${lowerPath} = :${paramName}`);
    });

    const sql = conditions.length > 0 ? conditions.join(' AND ') : 'TRUE';

    return Raw(() => sql, parameters);
  }
}
