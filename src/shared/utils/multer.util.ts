import fs from 'fs';
import { extname, join } from 'path';

import { DynamicModule, HttpStatus } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

import { AppException, ERROR_MESSAGES, SERVE_STATIC_OPTIONS } from '@/shared';

export class MulterUtil {
  static getOptions(rootDir: string, internalDir: string): MulterOptions {
    const destination = join(rootDir, internalDir);

    return {
      storage: diskStorage({
        destination,
        filename: (
          _req: Express.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ): void => {
          const uniqueSuffix: string = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}`;
          const fileExt: string = extname(file.originalname);
          callback(null, `${uniqueSuffix}${fileExt}`);
        },
      }),
    };
  }

  static getModule(rootDir: string, internalDir: string): DynamicModule {
    return MulterModule.register(MulterUtil.getOptions(rootDir, internalDir));
  }

  static isLocated(
    dirName: string,
    fileName: string,
    throwIfNot: boolean,
  ): boolean {
    const { rootPath } = SERVE_STATIC_OPTIONS;

    const fullFileName = join(rootPath, fileName);

    const doesExist = fs.existsSync(fullFileName);

    if (!doesExist && throwIfNot) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.NOT_FOUND_TEMPLATE,
        { value: fileName },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValidDir = fileName.startsWith(dirName);

    if (!isValidDir && throwIfNot) {
      throw AppException.fromTemplate(
        ERROR_MESSAGES.STATIC_DIRECTORY_MISMATCH_TEMPLATE,
        { dirName, fileName },
        HttpStatus.BAD_REQUEST,
      );
    }

    return isValidDir;
  }
}
