import { ApiProperty } from '@nestjs/swagger';

export enum FilterTypes {
  NORMAL = 'normal',
  GREYSCALE = 'greyscale',
  INVERT = 'invert',
  SEPIA = 'sepia',
}

export enum Direction {
  NONE = 'none',
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export class FilterForCreate {
  @ApiProperty({ enum: FilterTypes })
  filterType!: FilterTypes;

  @ApiProperty({ type: Number, description: 'Blur value' })
  blur!: number;

  @ApiProperty({ enum: Direction })
  flip!: Direction;

  @ApiProperty({ enum: Direction })
  mirror!: Direction;

  @ApiProperty({ type: Number, description: 'Rotate value' })
  rotate!: number;

  @ApiProperty({
    type: Number,
    description: 'Posterize value',
  })
  posterize!: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'file in format jpeg, jpg, png',
  })
  file: any;
}
