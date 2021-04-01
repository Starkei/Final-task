import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Query } from 'mongoose';
import { User } from 'src/mongoose/schema/user.schema';
import { UserService } from 'src/users/user.service';
import { PostDto } from './post.dto';
import { Post, PostDocument } from '../mongoose/schema/post.schema';
import { Comment } from 'src/mongoose/schema/comment.schema';
import { sendEmail } from './mail-sender';
import { validateEmail } from 'src/validators/validate-email.util';
import { validateId } from 'src/validators/validate-id.util';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly userService: UserService,
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
    postData: Partial<PostDto>,
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
    if (postData.marks)
      await post.update({
        ...postData,
        marks: await this.userService.pullUsersByDisplayNameOrEmail(
          postData.marks,
        ),
      });
    else await post.update({ ...(<Omit<Partial<PostDto>, 'marks'>>postData) });
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

  async createPost(email: string, postDto: PostDto): Promise<Post> {
    validateEmail(email);
    const author: User = await this.userService.getUserByEmail(email);
    const marks: User[] = await this.userService.pullUsersByDisplayNameOrEmail(
      postDto.marks,
    );
    const emails: string[] = marks.map((user: User) => user.email);
    const createdPost: Post = await this.postModel.create({
      title: postDto.title,
      image: postDto.image,
      tags: postDto.tags,
      marks,
      author,
    });
    if (!createdPost._id)
      throw new BadRequestException({
        _id: createdPost._id,
        message: 'Invalid id',
      });
    let postUrl: string | undefined;
    if (postDto.urlToPosts)
      postUrl = `${postDto.urlToPosts}/${createdPost._id}`;
    await sendEmail(emails, postDto.title, postDto.tags, author, postUrl);
    const post: Post = await this.getPostById(createdPost._id);
    this.userService.addPostToUser(email, post);
    return post;
  }
}
