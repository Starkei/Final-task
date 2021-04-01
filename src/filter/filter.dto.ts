import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ enum: FilterTypes })
  @IsNotEmpty()
  filterType!: FilterTypes;

  @ApiProperty({ type: Number, description: 'Blur value' })
  @IsNotEmpty()
  @IsNumber()
  blur!: number;

  @ApiProperty({ enum: Direction })
  @IsNotEmpty()
  flip!: Direction;

  @ApiProperty({ enum: Direction })
  @IsNotEmpty()
  mirror!: Direction;

  @ApiProperty({ type: Number, description: 'Rotate value' })
  @IsNotEmpty()
  @IsNumber()
  rotate!: number;

  @ApiProperty({
    type: Number,
    description: 'Posterize value',
  })
  @IsNotEmpty()
  @IsNumber()
  posterize!: number;
}
