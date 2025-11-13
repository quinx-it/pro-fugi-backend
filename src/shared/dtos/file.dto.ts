import { join } from 'path';

import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { IsString } from 'class-validator';

import { IFile } from '@/shared';

export class FileDto implements IFile {
  @ApiProperty()
  @IsString()
  fileName!: string;

  static fromDir(dirName: string, fileName: string): FileDto {
    const fullFileName = join(dirName, fileName);

    return plainToInstance(FileDto, { fileName: fullFileName });
  }
}
