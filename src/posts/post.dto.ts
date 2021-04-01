import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class PostDto {
  @ApiProperty()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'string array of user emails or displayNames',
  })
  @IsArray()
  marks!: string[];

  @ApiProperty({ type: String, format: 'url', description: 'Url to image' })
  image!: string;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  @IsArray()
  tags!: string[];

  @ApiPropertyOptional({
    description: 'Url to posts storage on frontend, used in email sender',
    example: 'protocol://domain/{urlToPosts}',
  })
  urlToPosts?: string;
}
