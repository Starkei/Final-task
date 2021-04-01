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
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { extractValueFromUser, validateUser } from 'src/auth/request-user.util';
import { User } from 'src/mongoose/schema/user.schema';
import { PostDto, PostForUpdateDto } from './post.dto';
import { Post as PostEntity } from '../mongoose/schema/post.schema';

import { PostService } from './post.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreatedPost,
  ProfilePost,
  SwaggerPostForCreate,
  SwaggerPutPostDto,
} from 'src/swagger-types/post.type';
import {
  BadRequestError,
  UnauthorizedError,
} from 'src/swagger-types/request-errors.types';
import { ConvertFormDataToPostDto } from './convert-forms-data-to-array.pipe';
import { ConvertFormDataToPutPostDto } from './convert-forms-data-to-put-post.pipe';
import { FormDataToNumberPipe } from 'src/filter/filterDto-formatter.pipe';

@ApiTags('Posts')
@Controller('api/v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar image, accept types: jpeg, jpg, png',
    type: SwaggerPostForCreate,
  })
  @ApiBody({ type: SwaggerPostForCreate })
  @ApiCreatedResponse({ type: CreatedPost })
  @ApiUnauthorizedResponse({ type: UnauthorizedError })
  @ApiBadRequestResponse({ type: BadRequestError })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @Req() req: Request,
    @UploadedFile() image: Express.Multer.File,
    @Body(
      new FormDataToNumberPipe(),
      new ConvertFormDataToPostDto(),
      new ValidationPipe({ transform: true }),
    )
    postDto: PostDto,
  ): Promise<PostEntity> {
    return validateUser<Promise<PostEntity>>(req.user, async () => {
      const email: string = extractValueFromUser<User, string>(
        req.user,
        'email',
      );
      return this.postService.createPost(email, image, postDto);
    });
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    example: '6065d270bc74253c8caf6e2b',
    description: 'Post id in format objectId',
  })
  @ApiOkResponse({ description: 'Delete post, and return nothing' })
  @ApiUnauthorizedResponse({
    type: UnauthorizedError,
    description: 'If user is invalid',
  })
  @ApiBadRequestResponse({ type: BadRequestError })
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

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    required: true,
    example: '6065d270bc74253c8caf6e2b',
    description: 'Post id in format objectId',
  })
  @ApiBody({ type: SwaggerPutPostDto })
  @ApiOkResponse({ description: 'Update post, and return nothing' })
  @ApiUnauthorizedResponse({
    type: UnauthorizedError,
    description: 'If user is invalid',
  })
  @ApiBadRequestResponse({ type: BadRequestError })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @Put(':id')
  async updatePost(
    @Req() req: Request,
    @Param('id') postId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body(
      new FormDataToNumberPipe(),
      new ConvertFormDataToPutPostDto(),
      new ValidationPipe({ transform: true }),
    )
    postDto: PostForUpdateDto,
  ): Promise<void> {
    return validateUser<Promise<void>>(req.user, async () => {
      const email: string = extractValueFromUser<User, string>(
        req.user,
        'email',
      );
      return this.postService.updatePostById(email, postId, file, postDto);
    });
  }

  @ApiOkResponse({ type: ProfilePost, isArray: true })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'User id in objectId format',
  })
  @ApiQuery({ name: 'tags', required: false, isArray: true, type: String })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'How many posts to skip, like pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'How many posts return, like pagination',
  })
  @ApiBadRequestResponse({ type: BadRequestError })
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

  @ApiOkResponse({ type: ProfilePost })
  @ApiParam({
    name: 'id',
    required: true,
    example: '6065d270bc74253c8caf6e2b',
    description: 'Post id in format objectId',
  })
  @ApiBadRequestResponse({ type: BadRequestError })
  @Get(':id')
  async getPostById(@Param('id') postId: string): Promise<PostEntity> {
    return this.postService.getPostById(postId);
  }
}
