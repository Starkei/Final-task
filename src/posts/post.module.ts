import { Module } from '@nestjs/common';
import { CommentService } from 'src/comments/comment.service';
import { MongoModule } from 'src/mongoose/mongo.module';
import { UserService } from 'src/users/user.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [MongoModule],
  controllers: [PostController],
  providers: [PostService, UserService, CommentService],
  exports: [PostService],
})
export class PostModule {}
