import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfilePost } from './post.type';

export class Profile {
  @ApiPropertyOptional({
    type: String,
    format: 'url',
    description: 'Url to image',
  })
  avatar?: string;

  @ApiProperty({ type: ProfilePost, isArray: true })
  posts!: ProfilePost[];

  @ApiProperty({ format: 'objectId', uniqueItems: true })
  _id!: string;

  @ApiProperty({ uniqueItems: true, format: 'email' })
  email!: string;

  @ApiProperty({ uniqueItems: true })
  displayName?: string;
}
