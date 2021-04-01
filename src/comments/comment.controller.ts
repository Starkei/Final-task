import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { extractValueFromUser, validateUser } from 'src/auth/request-user.util';
import { User } from 'src/mongoose/schema/user.schema';
import { CreatedComment } from 'src/swagger-types/comment.type';
import {
  BadRequestError,
  UnauthorizedError,
} from 'src/swagger-types/request-errors.types';
import { Comment } from '../mongoose/schema/comment.schema';
import { CommentDto } from './comment.dto';
import { CommentService } from './comment.service';
@ApiTags('Comments')
@Controller('api/v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @ApiBody({ type: CommentDto })
  @ApiCreatedResponse({ type: CreatedComment })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiUnauthorizedResponse({ type: UnauthorizedError })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addComment(
    @Req() req: Request,
    @Body(new ValidationPipe()) comment: CommentDto,
  ): Promise<Comment> {
    return validateUser<Promise<Comment>>(req.user, () => {
      const email: string = extractValueFromUser<User, string>(
        req.user,
        'email',
      );
      return this.commentService.addComment(
        email,
        comment.postId,
        comment.content,
      );
    });
  }
}
