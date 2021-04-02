import { Module } from '@nestjs/common';
import { MongoModule } from 'src/mongoose/mongo.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [MongoModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
