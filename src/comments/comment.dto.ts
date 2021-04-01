import { ApiProduces, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CommentDto {
  @ApiProperty({
    type: String,
    format: 'objectId',
    description: 'Post id',
    example: '6065d270bc74253c8caf6e2b',
  })
  @IsNotEmpty()
  postId!: string;

  @ApiProperty({ type: String, description: 'Comment content' })
  @IsNotEmpty()
  content!: string;
}
