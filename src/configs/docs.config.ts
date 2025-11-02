import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { DOCS } from '@/shared';

import type { INestApplication } from '@nestjs/common';
import type { SwaggerCustomOptions } from '@nestjs/swagger';

export class DocsUtil {
  static setup(app: INestApplication): void {
    const configs = new DocumentBuilder()
      .setTitle(DOCS.REST_API.TITLE)
      .addBearerAuth()
      .build();

    const swaggerCustomOptions: SwaggerCustomOptions = {
      swaggerOptions: { persistAuthorization: true },
    };

    const document = SwaggerModule.createDocument(app, configs);

    SwaggerModule.setup(
      DOCS.REST_API.ENDPOINT,
      app,
      document,
      swaggerCustomOptions,
    );
  }
}
