import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'file in format jpeg, jpg, png',
  })
  file: any;
}
