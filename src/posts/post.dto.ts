import { IsNotEmpty } from 'class-validator';
import { FilterDto } from 'src/filter/filter.dto';

export class PostDto extends FilterDto {
  @IsNotEmpty()
  title!: string;

  marks?: string[];

  tags?: string[];

  urlToPosts?: string;
}

export class PostForUpdateDto extends FilterDto {
  title?: string;

  marks?: string[];

  tags?: string[];

  urlToPosts?: string;
}
