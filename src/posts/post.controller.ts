import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { extractValueFromUser, validateUser } from 'src/auth/request-user.util';
import { User } from 'src/mongoose/schema/user.schema';
import { PostDto } from './post.dto';
import { Post as PostEntity } from '../mongoose/schema/post.schema';

import { PostService } from './post.service';

@Controller('api/v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @Req() req: Request,
    @UploadedFile() image: Express.Multer.File,
    @Body() postDto: PostDto,
  ): Promise<PostEntity> {
    return validateUser<Promise<PostEntity>>(req.user, () => {
      const email: string = extractValueFromUser<User, string>(
        req.user,
        'email',
      );
      postDto.image = { data: image.buffer, contentType: image.mimetype };
      return this.postService.createPost(email, postDto);
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async removePost(
    @Req() req: Request,
    @Param('id') postId: string,
  ): Promise<void> {
    return validateUser<Promise<void>>(req.user, () => {
      const email: string = extractValueFromUser<User, string>(
        req.user,
        'email',
      );
      return this.postService.deletePostById(email, postId);
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updatePost(
    @Req() req: Request,
    @Param('id') postId: string,
    @Body() postDto: Partial<PostDto>,
  ): Promise<void> {
    return validateUser<Promise<void>>(req.user, () => {
      const email: string = extractValueFromUser<User, string>(
        req.user,
        'email',
      );
      return this.postService.updatePostById(email, postId, postDto);
    });
  }

  @Get()
  async getPosts(
    @Query('userId') userId: string,
    @Query('tags') tags: string[],
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<PostEntity[]> {
    return this.postService.getAllPosts(
      userId,
      tags,
      Number(skip),
      Number(limit),
    );
  }

  @Get(':id')
  async getPostById(@Param('id') postId: string): Promise<PostEntity> {
    return this.postService.getPostById(postId);
  }
}
