import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Avatar, ProfileService } from './profile.service';
import { User } from '../mongoose/schema/user.schema';
import { extractValueFromUser, validateUser } from 'src/auth/request-user.util';

@Controller('api/v1/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  async getProfileById(@Param('id') userId: string): Promise<User> {
    return this.profileService.getUserProfile(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getProfile(@Req() req: Request): Promise<User> {
    return validateUser<Promise<User>>(req.user, () => {
      const userId: string = extractValueFromUser<User>(req.user, 'id');
      return this.profileService.getUserProfile(userId);
    });
  }

  @Put('update-display-name')
  @UseGuards(AuthGuard('jwt'))
  async changeDisplayName(
    @Req() req: Request,
    @Body('displayName') displayName: string,
  ): Promise<void> {
    if (req.user) {
      const email: string = (<User>req.user).email;
      return this.profileService.updateDisplayName(email, displayName);
    }
    throw new UnauthorizedException({
      user: req.user,
      message: 'User is not defined',
    });
  }

  @Put('update-avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async changeAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    if (req.user) {
      const email: string = (<User>req.user).email;
      const avatar: Avatar = { data: file.buffer, contentType: file.mimetype };
      return this.profileService.updateAvatar(email, avatar);
    }
    throw new UnauthorizedException({
      user: req.user,
      message: 'User is not defined',
    });
  }
}
