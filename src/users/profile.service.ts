import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileService, Image } from 'src/files/file.service';
import { FilterDto } from 'src/filter/filter.dto';
import { FilterService } from 'src/filter/filter.service';
import { validateEmail } from 'src/validators/validate-email.util';
import { validateId } from 'src/validators/validate-id.util';
import { validateImageContent } from 'src/validators/validate-image-type.util';
import { User, UserDocument } from '../mongoose/schema/user.schema';
import { ProfileForUpdateDto } from './profile-for-update.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly imageService: FileService,
    private readonly filterService: FilterService,
  ) {}

  async validateIsUserExists(userId: string) {
    const user: UserDocument | null = await this.userModel.findById(userId);
    if (!user)
      throw new BadRequestException({
        userId,
        message: 'User with this id not found',
      });
  }

  async validateIsUserWithDisplayNameExists(displayName: string) {
    const user: UserDocument | null = await this.userModel.findOne({
      displayName,
    });
    if (user)
      throw new BadRequestException({
        displayName,
        message: 'User with this display name is exists',
      });
  }

  async validateIsUserWithEmail(email: string) {
    const user: UserDocument | null = await this.userModel.findOne({
      email,
    });
    if (user)
      throw new BadRequestException({
        email,
        message: 'User with this email is exists',
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

  private async updateOldImageAvatar(
    oldImageName: string,
    filters: FilterDto,
  ): Promise<string> {
    const image: Image = await this.imageService.getImage(oldImageName);
    return this.filterService.applyFilters(image, filters);
  }

  private async updateNewImageAvatar(
    newImageName: Express.Multer.File,
    filters: FilterDto,
  ): Promise<string> {
    const image: Image = { ...newImageName };
    return this.filterService.applyFilters(image, filters);
  }

  async updateProfile(
    userEmail: string,
    avatar: Express.Multer.File,
    profileForUpdate: ProfileForUpdateDto,
  ): Promise<void> {
    //Validate user data
    validateEmail(userEmail);

    const user: UserDocument | null = await this.userModel.findOne({
      email: userEmail,
    });

    if (!user)
      throw new BadRequestException({
        userEmail: userEmail,
        message: 'User with this email not found',
      });

    if (profileForUpdate.displayName) {
      await this.validateIsUserWithDisplayNameExists(
        profileForUpdate.displayName,
      );
      user.displayName = profileForUpdate.displayName;
    }
    let oldAvatar: string | undefined;
    if (user.avatar) oldAvatar = user.avatar;
    if (!avatar && user.avatar)
      user.avatar = await this.updateOldImageAvatar(
        user.avatar,
        profileForUpdate,
      );
    if (avatar) {
      validateImageContent(avatar.mimetype);
      user.avatar = await this.updateNewImageAvatar(avatar, profileForUpdate);
    }
    if (oldAvatar) await this.imageService.removeImage(oldAvatar);
    await user.update({ avatar: user.avatar, displayName: user.displayName });
  }
}
