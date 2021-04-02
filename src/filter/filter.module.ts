import { Module } from '@nestjs/common';
import { FileModule } from 'src/files/file.module';
import { FilterService } from './filter.service';
import { FormDataToNumberPipe } from './filterDto-formatter.pipe';

@Module({
  imports: [FileModule],
  providers: [FilterService, FormDataToNumberPipe],
  exports: [FilterService],
})
export class FilterModule {}
