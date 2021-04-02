import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Query } from 'mongoose';
import { User } from 'src/mongoose/schema/user.schema';
import { UserService } from 'src/users/user.service';
import { PostDto, PostForUpdateDto } from './post.dto';
import { Post, PostDocument } from '../mongoose/schema/post.schema';
import { Comment } from 'src/mongoose/schema/comment.schema';
import { sendEmail } from './mail-sender';
import { validateEmail } from 'src/validators/validate-email.util';
import { validateId } from 'src/validators/validate-id.util';
import { validateImageContent } from 'src/validators/validate-image-type.util';
import { FilterService } from 'src/filter/filter.service';
import { FileService, Image } from 'src/files/file.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly userService: UserService,
    private readonly filterService: FilterService,
    private readonly imageService: FileService,
  ) {}

  async getPostsByAuthor(authorEmail: string): Promise<Post[]> {
    const user: User = await this.userService.getUserByEmail(authorEmail);
    return this.postModel.find({ author: user });
  }

  async getAllPosts(
    userId?: string,
    tags?: string[],
    paginationSkip?: number,
    paginationLimit?: number,
  ): Promise<Post[]> {
    let query: Query<PostDocument[], PostDocument, any>;
    let filterQuery: FilterQuery<PostDocument> = {};

    //FilterQuery
    if (tags && tags.length) filterQuery = { tags: { $in: tags } };
    if (userId) {
      const user: User = await this.userService.getUserById(userId);
      filterQuery = { ...filterQuery, author: user };
    }
    //Accept filter query
    query = this.postModel.find(filterQuery);

    //Accept population
    query = query.populate('author', '-password');

    //Pagination
    if (paginationSkip && paginationSkip > 0)
      query = query.skip(paginationSkip);
    if (paginationLimit && paginationLimit > 0)
      query = query.limit(paginationLimit);

    //Return result
    return query.exec();
  }

  async getPostById(postId: string): Promise<Post> {
    const post: Post | null = await this.postModel
      .findOne({ _id: postId })
      .populate('marks', '-password')
      .populate('author', '-password')
      .populate('comments')
      .exec();
    if (!post)
      throw new BadRequestException({
        postId,
        message: 'Post with id not found',
      });
    return post;
  }

  async deletePostById(ownerEmail: string, postId: string): Promise<void> {
    const owner: User = await this.userService.getUserByEmail(ownerEmail);
    const post: PostDocument | null = await this.postModel.findOne({
      _id: postId,
      author: owner,
    });
    if (!post)
      throw new BadRequestException({
        postId,
        message: 'Post with id not found',
      });

    //Add comments deletition
    await this.userService.deletePostFromUser(ownerEmail, post);
    await post.delete();
  }

  async updatePostById(
    ownerEmail: string,
    postId: string,
    imageForUpdate: Express.Multer.File,
    postData: PostForUpdateDto,
  ): Promise<void> {
    validateEmail(ownerEmail);

    const owner: User = await this.userService.getUserByEmail(ownerEmail);
    const post: PostDocument | null = await this.postModel.findOne({
      _id: postId,
      author: owner,
    });
    if (!post)
      throw new BadRequestException({
        postId,
        message: 'Post with id not found',
      });

    if (imageForUpdate) {
      if (post.image) await this.imageService.removeImage(post.image);
      validateImageContent(imageForUpdate.mimetype);
      const image: string = await this.filterService.applyFilters(
        { ...imageForUpdate },
        postData,
      );
      post.image = image;
    }
    if (postData.marks)
      post.marks = await this.userService.pullUsersByDisplayNameOrEmail(
        postData.marks,
      );
    if (postData.title) post.title = postData.title;
    if (postData.tags) post.tags = postData.tags;

    await post.update(post);
    const updatedPost: PostDocument | null = await this.postModel
      .findById(post.id)
      .populate('marks')
      .exec();
    if (!updatedPost)
      throw new BadRequestException({ message: 'Post incorractly updates' });
    if (updatedPost.marks && updatedPost.marks.length) {
      const emails: string[] = updatedPost.marks.map(
        (user: User) => user.email,
      );
      await sendEmail(
        emails,
        updatedPost.title,
        updatedPost.tags,
        updatedPost.author,
        postData.urlToPosts,
      );
    }
  }

  async addCommentToPost(postId: string, comment: Comment): Promise<void> {
    validateId(postId);
    const post: PostDocument | null = await this.postModel.findById(postId);
    if (!post)
      throw new BadRequestException({
        postId,
        message: 'Post with id not found',
      });
    await post.update({ comments: [...post.comments, comment] });
  }

  async createPost(
    email: string,
    imageForCreate: Express.Multer.File,
    postDto: PostDto,
  ): Promise<Post> {
    validateEmail(email);
    validateImageContent(imageForCreate.mimetype);

    const author: User = await this.userService.getUserByEmail(email);
    let marks: User[] = [];
    let tags: string[] = [];
    if (postDto.marks)
      marks = await this.userService.pullUsersByDisplayNameOrEmail(
        postDto.marks,
      );
    if (postDto.tags) tags = postDto.tags;
    const emails: string[] = marks.map((user: User) => user.email);
    const image: Image = { ...imageForCreate };
    const imageUrl: string = await this.filterService.applyFilters(
      image,
      postDto,
    );

    const createdPost: Post = await this.postModel.create({
      title: postDto.title,
      image: imageUrl,
      tags: postDto.tags,
      marks,
      author,
    });
    this.userService.addPostToUser(email, createdPost);
    if (!createdPost._id)
      throw new BadRequestException({
        _id: createdPost._id,
        message: 'Invalid id',
      });
    let postUrl: string | undefined;
    if (postDto.urlToPosts)
      postUrl = `${postDto.urlToPosts}/${createdPost._id}`;
    if (emails.length)
      await sendEmail(emails, postDto.title, tags, author, postUrl);
    const post: Post = await this.getPostById(createdPost._id);
    return post;
  }
}
