export class PostDto {
  title!: string;

  marks!: string[];

  image!: { data: Buffer; contentType: string };

  tags!: string[];

  urlToPosts?: string;
}
