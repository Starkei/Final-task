import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Profile } from './profile.types';

export class PostForCreate {
  @ApiProperty()
  title!: string;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'string array of user emails or displayNames',
  })
  marks!: string[];

  @ApiProperty({
    type: String,
    format: 'url',
    description: 'Url to image',
  })
  image!: string;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  tags!: string[];

  @ApiPropertyOptional({
    description: 'Url to posts storage on frontend, used in email sender',
    example: 'protocol://domain/{urlToPosts}',
  })
  urlToPosts?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'file in format jpeg, jpg, png',
  })
  file: any;
}

export class CreatedPost {
  @ApiProperty({
    type: String,
    format: 'url',
    description: 'Url to image',
  })
  image!: string;

  @ApiProperty({ type: String, isArray: true })
  tags!: string[];

  @ApiProperty({ type: String, isArray: true })
  comments!: string[];

  @ApiProperty({ type: () => Profile, isArray: true })
  marks!: Profile[];

  @ApiProperty({ format: 'objectId' })
  _id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ type: () => Profile })
  author!: Profile;
}

export class ProfilePost {
  @ApiProperty({
    type: String,
    format: 'url',
    description: 'Url to image',
  })
  image!: string;

  @ApiProperty({ type: String, isArray: true })
  tags!: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    description: "string array of objectId's",
  })
  comments!: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    description: "string array of objectId's",
  })
  marks!: string[];

  @ApiProperty({ format: 'objectId' })
  _id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ format: 'objectId' })
  author!: string;
}

export class PutPost {
  @ApiPropertyOptional({
    type: String,
    format: 'url',
    description: 'Url to image',
  })
  image!: string;

  @ApiPropertyOptional({ type: String, isArray: true })
  tags!: string[];

  @ApiPropertyOptional({
    type: String,
    isArray: true,
    description: 'User emails or display names',
  })
  marks!: string[];

  @ApiPropertyOptional()
  title!: string;
}
