import { Module } from '@nestjs/common';
import { PostService } from 'src/posts/post.service';
import { UserService } from 'src/users/user.service';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MongoModule } from 'src/mongoose/mongo.module';

@Module({
  imports: [MongoModule],
  controllers: [CommentController],
  providers: [CommentService, UserService, PostService],
  exports: [CommentService],
})
export class CommentModule {}
