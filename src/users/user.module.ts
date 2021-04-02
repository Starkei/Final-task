import { Module } from '@nestjs/common';
import { PostService } from 'src/posts/post.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserService } from './user.service';
import { MongoModule } from 'src/mongoose/mongo.module';
import { FilterService } from 'src/filter/filter.service';
import { FileModule } from 'src/files/file.module';

@Module({
  imports: [MongoModule, FileModule],
  controllers: [ProfileController],
  providers: [UserService, PostService, ProfileService, FilterService],
  exports: [UserService],
})
export class UserModule {}
