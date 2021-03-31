import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { extractValueFromUser, validateUser } from 'src/auth/request-user.util';
import { User } from 'src/mongoose/schema/user.schema';
import { Comment } from '../mongoose/schema/comment.schema';
import { CommentService } from './comment.service';

@Controller('api/v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addComment(
    @Req() req: Request,
    @Body('postId') postId: string,
    @Body('content') content: string,
  ): Promise<Comment> {
    return validateUser<Promise<Comment>>(req.user, () => {
      const email: string = extractValueFromUser<User, string>(
        req.user,
        'email',
      );
      return this.commentService.addComment(email, postId, content);
    });
  }
}
