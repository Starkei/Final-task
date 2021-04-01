import { ApiProperty } from '@nestjs/swagger';

export class BadRequestError {
  @ApiProperty({ default: 400 })
  status!: 400;

  @ApiProperty({ description: 'Error message' })
  message!: string;
}
export class UnauthorizedError {
  @ApiProperty({ default: 401 })
  status!: 401;

  @ApiProperty({ description: 'Error message' })
  message!: string;
}
