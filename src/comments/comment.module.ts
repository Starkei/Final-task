import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MongoModule } from 'src/mongoose/mongo.module';
import { PostService } from 'src/posts/post.service';
import { UserService } from 'src/users/user.service';
import { FilterService } from 'src/filter/filter.service';
import { FileService } from 'src/files/file.service';

@Module({
  imports: [MongoModule],
  controllers: [CommentController],
  providers: [
    CommentService,
    PostService,
    UserService,
    FilterService,
    FileService,
  ],
  exports: [CommentService],
})
export class CommentModule {}
