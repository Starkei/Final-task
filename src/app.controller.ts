import {
  ArgumentMetadata,
  Body,
  Controller,
  Get,
  Injectable,
  PipeTransform,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import * as Jimp from 'jimp';
import { IsNotEmpty, IsNumber } from 'class-validator';

enum FilterTypes {
  NORMAL = 'normal',
  GREYSCALE = 'greyscale',
  INVERT = 'invert',
  SEPIA = 'sepia',
}

enum Direction {
  NONE = 'none',
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

class Filter {
  @IsNotEmpty()
  filterType!: FilterTypes;

  @IsNotEmpty()
  @IsNumber()
  blur!: number;

  @IsNotEmpty()
  flip!: Direction;

  @IsNotEmpty()
  mirror!: Direction;

  @IsNotEmpty()
  @IsNumber()
  rotate!: number;

  @IsNotEmpty()
  @IsNumber()
  posterize!: number;
}
@Injectable()
class FormDataToNumberPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(filter: Filter, _metadata: ArgumentMetadata): Filter {
    filter = {
      ...filter,
      blur: Number(filter.blur),
      rotate: Number(filter.rotate),
      posterize: Number(filter.posterize),
    };
    return filter;
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getFrontPage() {
    return {};
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async getHello(
    @UploadedFile() file: Express.Multer.File,
    @Body(new FormDataToNumberPipe(), new ValidationPipe({ transform: true }))
    filter: Filter,
  ) {
    let image = await Jimp.read(file.buffer);
    if (filter.filterType !== FilterTypes.NORMAL) {
      image = image[filter.filterType]();
    }
    if (filter.blur > 0 && filter.blur <= 100) {
      image = image.blur(filter.blur);
    }
    if (filter.flip !== Direction.NONE) {
      if (filter.flip === Direction.HORIZONTAL) image = image.flip(true, false);
      else if (filter.flip === Direction.VERTICAL)
        image = image.flip(false, true);
    }
    if (filter.mirror !== Direction.NONE) {
      if (filter.mirror === Direction.HORIZONTAL)
        image = image.mirror(true, false);
      else if (filter.mirror === Direction.VERTICAL)
        image = image.mirror(false, true);
    }

    if (filter.rotate !== 0 && filter.rotate !== 360) {
      image = image.rotate(filter.rotate);
    }
    if (filter.posterize > 0) {
      image = image.posterize(3);
    }
    const buffer = await image.getBufferAsync(file.mimetype);
    return { buffer, type: file.mimetype };
  }
}
