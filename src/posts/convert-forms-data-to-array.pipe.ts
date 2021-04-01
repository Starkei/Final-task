import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ConvertFormDataToPostDto implements PipeTransform {
  transform(form: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      if (form.marks && !Array.isArray(form.marks)) form.marks = [form.marks];
      if (form.tags && !Array.isArray(form.tags)) form.tags = [form.tags];
    }
    return form;
  }
}
