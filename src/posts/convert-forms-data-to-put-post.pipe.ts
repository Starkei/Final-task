import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Post } from 'src/mongoose/schema/post.schema';

@Injectable()
export class ConvertFormDataToPutPostDto implements PipeTransform {
  transform(form: any, metadata: ArgumentMetadata): Partial<Post> {
    if (metadata.type === 'body') {
      if (form.marks && !Array.isArray(form.marks)) form.marks = [form.marks];
      if (form.tags && !Array.isArray(form.tags)) form.tags = [form.tags];
    }
    return form;
  }
}
