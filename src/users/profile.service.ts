import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { storeImage } from 'src/store-image.util';
import { validateEmail } from 'src/validators/validate-email.util';
import { validateId } from 'src/validators/validate-id.util';
import { validateImageContent } from 'src/validators/validate-image-type.util';
import { User, UserDocument } from '../mongoose/schema/user.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async validateIsUserExists(userId: string) {
    const user: UserDocument | null = await this.userModel.findById(userId);
    if (!user)
      throw new BadRequestException({
        userId,
        message: 'User with this id not found',
      });
  }
  async getUserProfile(userId: string): Promise<User> {
    validateId(userId);
    await this.validateIsUserExists(userId);
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
    validateEmail(userEmail);
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

  async updateAvatar(
    userEmail: string,
    avatar: Express.Multer.File,
  ): Promise<void> {
    validateEmail(userEmail);
    validateImageContent(avatar.mimetype);
    const user: UserDocument | null = await this.userModel.findOne({
      email: userEmail,
    });
    if (!user)
      throw new BadRequestException({
        userEmail: userEmail,
        message: 'User with this email not found',
      });
    const url: string = await storeImage({ ...avatar });
    await user.update({ avatar: url });
  }
}
