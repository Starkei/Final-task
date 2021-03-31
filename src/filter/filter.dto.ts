import { IsNotEmpty, IsNumber } from 'class-validator';

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

export class FilterDto {
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
