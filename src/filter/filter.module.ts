import { Module } from '@nestjs/common';
import { FilterController } from './filter.controller';
import { FilterService } from './filter.service';
import { FormDataToNumberPipe } from './filterDto-formatter.pipe';

@Module({
  controllers: [FilterController],
  providers: [FilterService, FormDataToNumberPipe],
  exports: [FilterService],
})
export class FilterModule {}
