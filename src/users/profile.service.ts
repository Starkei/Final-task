import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../mongoose/schema/user.schema';

export type Avatar = { data: Buffer; contentType: string };

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getUserProfile(userId: string): Promise<User> {
    const profile: UserDocument | null = await this.userModel
      .findOne({ _id: userId })
      .select(['-password', '-coments'])
      .populate('posts')
      .exec();
    if (!profile)
      throw new BadRequestException({
        userId,
        message: 'Profile with this id not found',
      });
    return profile;
  }

  async updateDisplayName(
    userEmail: string,
    newDisplayName: string,
  ): Promise<void> {
    const user: UserDocument | null = await this.userModel.findOne({
      email: userEmail,
    });
    if (!user)
      throw new BadRequestException({
        userEmail: userEmail,
        message: 'User with this email not found',
      });
    await user.update({ displayName: newDisplayName });
  }

  async updateAvatar(userEmail: string, avatar: Avatar): Promise<void> {
    const user: UserDocument | null = await this.userModel.findOne({
      email: userEmail,
    });
    if (!user)
      throw new BadRequestException({
        userEmail: userEmail,
        message: 'User with this email not found',
      });
    await user.update({ avatar });
  }
}
