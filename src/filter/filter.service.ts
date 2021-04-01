import { Injectable } from '@nestjs/common';
import * as Jimp from 'jimp';
import { storeImage } from 'src/store-image.util';
import { Direction, FilterDto, FilterTypes } from './filter.dto';

@Injectable()
export class FilterService {
  async applyFilters(
    file: Express.Multer.File,
    filter: FilterDto,
  ): Promise<string> {
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
    return await storeImage({
      buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });
  }
}
