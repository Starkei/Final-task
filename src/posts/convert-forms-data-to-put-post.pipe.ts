import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Post } from 'src/mongoose/schema/post.schema';

@Injectable()
export class ConvertFormDataToPutPostDto implements PipeTransform {
  transform(form: any, metadata: ArgumentMetadata): Partial<Post> {
    if (metadata.type === 'body') {
      const newForm: any = {};
      for (const [key, value] of Object.entries(form)) {
        if (['title', 'marks', 'tags'].includes(key)) {
          newForm[key] = value;
        }
      }
      return newForm;
    }
    return form;
  }
}
