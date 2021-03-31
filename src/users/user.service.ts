import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { UserDto } from './user.dto';
import { User, UserDocument } from '../mongoose/schema/user.schema';
import { Post } from 'src/mongoose/schema/post.schema';
import { Comment } from 'src/mongoose/schema/comment.schema';

type ExistendUser = UserDocument | null;

@Injectable()
export class UserService {
  async isUserExists(userEmail: string): Promise<boolean> {
    const user: ExistendUser = await this.userModel.findOne({
      email: userEmail,
    });
    return user !== null;
  }

  private async validateIsUserExists(userDto: UserDto): Promise<void> {
    const exists: boolean = await this.isUserExists(userDto.email);
    if (exists)
      throw new BadRequestException({
        userEmail: userDto.email,
        message: 'User with this email is exists',
      });
  }

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async reqistrateUser(userDto: UserDto): Promise<User> {
    if (userDto.password) userDto.password = await hash(userDto.password, 10);
    await this.validateIsUserExists(userDto);
    return this.userModel.create(userDto);
  }

  async getUserById(userId: string): Promise<User> {
    const user: ExistendUser = await this.userModel.findOne({ _id: userId });
    if (!user)
      throw new BadRequestException({
        userId,
        message: 'User with this id not exists',
      });
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: ExistendUser = await this.userModel.findOne({ email });
    if (!user)
      throw new BadRequestException({
        email,
        message: 'User with this email not exists',
      });
    return user;
  }

  async addPostToUser(email: string, post: Post): Promise<void> {
    const userDoc: UserDocument | null = await this.userModel.findOne({
      email,
    });
    if (!userDoc)
      throw new BadRequestException({
        email,
        message: 'User with this email not exists',
      });
    await userDoc.update({ posts: [...userDoc.posts, post] });
  }

  async addCommentToUser(email: string, comment: Comment): Promise<void> {
    const userDoc: UserDocument | null = await this.userModel.findOne({
      email,
    });
    if (!userDoc)
      throw new BadRequestException({
        email,
        message: 'User with this email not exists',
      });
    await userDoc.update({ coments: [...userDoc.coments, comment] });
  }

  async deletePostFromUser(email: string, post: Post): Promise<void> {
    const userDoc: UserDocument | null = await this.userModel.findOne({
      email,
    });
    if (!userDoc)
      throw new BadRequestException({
        email,
        message: 'User with this email not exists',
      });
    const posts: Post[] = userDoc.posts.filter((userPost: Post) => {
      const postId: string = post._id + '';
      const userPostId: string = userPost._id + '';
      return postId !== userPostId;
    });
    await userDoc.update({ posts });
  }

  async pullUsersByDisplayNameOrEmail(
    emailsOrDisplayNames: string[],
  ): Promise<User[]> {
    const usersByEmail: User[] = await this.userModel.find({
      email: { $in: emailsOrDisplayNames },
    });
    const usersByDisplayName: User[] = await this.userModel.find({
      displayName: { $in: emailsOrDisplayNames },
    });
    return usersByEmail.concat(usersByDisplayName);
  }
}
