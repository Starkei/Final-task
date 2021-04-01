import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Direction, FilterTypes } from 'src/filter/filter.dto';
import { FilterForCreate } from './filter.type';
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

export class SwaggerProfileForUpdateDto extends FilterForCreate {
  @ApiPropertyOptional({ uniqueItems: true })
  displayName?: string;
}
