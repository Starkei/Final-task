import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schema/comment.schema';
import { ImageFile, ImageSchema } from './schema/file.shema';
import { Post, PostSchema } from './schema/post.schema';
import { User, UserSchema } from './schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
      { name: ImageFile.name, schema: ImageSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}
