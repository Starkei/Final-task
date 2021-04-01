import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    required: false,
    description:
      'Can be changed in /api/v1/profile/update-display-name, Extracts from facebook login',
  })
  displayName?: string;

  @ApiProperty({ required: true, uniqueItems: true, format: 'email' })
  email!: string;

  @ApiProperty({
    required: true,
    minLength: 6,
    maxLength: 32,
    description: 'Before adding to database -- hashing',
  })
  password?: string;
}
