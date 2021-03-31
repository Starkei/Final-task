import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { FilterDto } from './filter.dto';

@Injectable()
export class FormDataToNumberPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(filter: FilterDto, _metadata: ArgumentMetadata): FilterDto {
    filter = {
      ...filter,
      blur: Number(filter.blur),
      rotate: Number(filter.rotate),
      posterize: Number(filter.posterize),
    };
    return filter;
  }
}
