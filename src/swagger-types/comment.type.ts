import { ApiProperty } from '@nestjs/swagger';

export class Author {
  @ApiProperty({
    type: String,
    isArray: true,
    format: 'objectId',
    description: "Comment's ids",
  })
  comments!: string[];
  @ApiProperty({
    type: String,
    isArray: true,
    format: 'objectId',
    description: "Post's ids",
  })
  posts!: string[];
  @ApiProperty({ type: String, format: 'objectId' })
  _id!: string;
  @ApiProperty({ type: String, format: 'email' })
  email!: string;
}

export class CreatedComment {
  @ApiProperty({ type: String, format: 'objectId', description: 'Comment id' })
  _id!: string;

  @ApiProperty({ type: Author, description: 'Author profile' })
  author!: Author;

  @ApiProperty({ type: String, format: 'objectId', description: 'Comment id' })
  post!: string;

  @ApiProperty({ type: String, format: 'objectId', description: 'Comment id' })
  content!: string;
}
