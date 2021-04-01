import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterForCreate } from 'src/swagger-types/filter.type';
import { BadRequestError } from 'src/swagger-types/request-errors.types';
import { FilterDto } from './filter.dto';
import { FilterService } from './filter.service';
import { FormDataToNumberPipe } from './filterDto-formatter.pipe';

@ApiTags('Filter')
@Controller('api/v1/filters')
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FilterForCreate,
  })
  @ApiCreatedResponse({ type: String, description: 'Url to image' })
  @ApiBadRequestResponse({ type: BadRequestError })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async applyFilters(
    @UploadedFile() file: Express.Multer.File,
    @Body(new FormDataToNumberPipe(), new ValidationPipe({ transform: true }))
    filter: FilterDto,
  ): Promise<string> {
    return this.filterService.applyFilters(file, filter);
  }
}
