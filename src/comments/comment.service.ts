import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/mongoose/schema/post.schema';
import { PostService } from 'src/posts/post.service';
import { User } from 'src/mongoose/schema/user.schema';
import { UserService } from 'src/users/user.service';
import { Comment, CommentDocument } from '../mongoose/schema/comment.schema';
import { validateEmail } from 'src/validators/validate-email.util';
import { validateId } from 'src/validators/validate-id.util';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  async addComment(
    email: string,
    postId: string,
    content: string,
  ): Promise<Comment> {
    validateEmail(email);
    validateId(postId);
    const author: User = await this.userService.getUserByEmail(email);
    const post: Post = await this.postService.getPostById(postId);
    const comment: Comment = await this.commentModel.create({
      author,
      post,
      content,
    });
    await this.postService.addCommentToPost(postId, comment);
    await this.userService.addCommentToUser(email, comment);
    if (!comment._id)
      throw new BadRequestException({
        commentId: comment._id,
        message: 'Comment with this id not found',
      });
    const createdComment: Comment | null = await this.commentModel
      .findOne({ _id: comment._id })
      .populate('author', '-password')
      .exec();
    if (!createdComment)
      throw new BadRequestException({
        commentId: comment._id,
        message: 'Comment with this id not found',
      });
    return createdComment;
  }
}
