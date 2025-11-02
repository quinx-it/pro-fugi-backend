import { Param, ParseIntPipe } from '@nestjs/common';

import { ID_PARAM_NAME } from '@/shared/constants/end-points.constants';

export class EndPointsUtil {
  static ById = (
    paramName: string = ID_PARAM_NAME,
    next: string | null = null,
  ): string => {
    const endPoint = next ? `:${paramName}/${next}` : `:${paramName}`;

    return endPoint;
  };

  static IdParam = (paramName: string = ID_PARAM_NAME): ParameterDecorator =>
    Param(paramName, ParseIntPipe);
}
