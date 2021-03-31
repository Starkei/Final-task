import {
  Body,
  Controller,
  Get,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterDto } from './filter.dto';
import { FilterService } from './filter.service';
import { FormDataToNumberPipe } from './filterDto-formatter.pipe';

@Controller('api/v1/filters')
export class FilterController {
  constructor(private readonly filterService: FilterService) {}
  @Get()
  @UseInterceptors(FileInterceptor('file'))
  async applyFilters(
    @UploadedFile() file: Express.Multer.File,
    @Body(new FormDataToNumberPipe(), new ValidationPipe({ transform: true }))
    filter: FilterDto,
  ): Promise<{ data: Buffer; contentType: string }> {
    return this.filterService.applyFilters(file, filter);
  }
}
