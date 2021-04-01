import { Module } from '@nestjs/common';
import { FilterService } from './filter.service';
import { FormDataToNumberPipe } from './filterDto-formatter.pipe';

@Module({
  providers: [FilterService, FormDataToNumberPipe],
  exports: [FilterService],
})
export class FilterModule {}
