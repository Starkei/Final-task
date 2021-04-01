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
import { ProfileService } from './profile.service';
import { User } from '../mongoose/schema/user.schema';
import { extractValueFromUser, validateUser } from 'src/auth/request-user.util';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestError,
  UnauthorizedError,
} from 'src/swagger-types/request-errors.types';
import { FileUploadDto } from 'src/swagger-types/file-upload-dto.types';
import { Profile } from 'src/swagger-types/profile.types';

@ApiTags('Profile')
@Controller('api/v1/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':userId')
  @ApiParam({
    name: 'userId',
    description: 'should be in format Objectid',
    example: '6063921886018b2190c7b329',
  })
  @ApiResponse({
    status: 200,
    type: Profile,
    description: 'Return user object with post population',
  })
  @ApiResponse({
    status: 400,
    description: 'Return error if profile not found, Invalid id',
    type: BadRequestError,
  })
  async getProfileById(@Param('userId') userId: string): Promise<User> {
    return this.profileService.getUserProfile(userId);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: Profile,
    description: 'Return user object with post population',
  })
  @ApiResponse({
    status: 400,
    description: 'Return error if profile not found, Invalid id',
    type: BadRequestError,
  })
  @ApiResponse({
    status: 401,
    description: 'Return error if unauthorized',
    type: UnauthorizedError,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getProfile(@Req() req: Request): Promise<User> {
    return validateUser<Promise<User>>(req.user, () => {
      const userId: string = extractValueFromUser<User>(req.user, 'id');
      return this.profileService.getUserProfile(userId);
    });
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'displayName',
    required: true,
    description: 'should be unique',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Return nothing and update user's display name",
  })
  @ApiResponse({
    status: 400,
    description: 'Return error if profile not found, Invalid id',
    type: BadRequestError,
  })
  @ApiResponse({
    status: 400,
    description: 'Return error if profile with this display name exists',
    type: BadRequestError,
  })
  @ApiResponse({
    status: 401,
    description: 'Return error if unauthorized',
    type: UnauthorizedError,
  })
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

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar image, accept types: jpeg, jpg, png',
    type: FileUploadDto,
  })
  @ApiResponse({
    status: 200,
    description: "Return nothing and update user's avatar",
  })
  @ApiResponse({
    status: 400,
    description: 'Return error if profile not found, Invalid id',
    type: BadRequestError,
  })
  @ApiResponse({
    status: 401,
    description: 'Return error if unauthorized',
    type: UnauthorizedError,
  })
  @Put('update-avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async changeAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    if (req.user) {
      const email: string = (<User>req.user).email;
      return this.profileService.updateAvatar(email, file);
    }
    throw new UnauthorizedException({
      user: req.user,
      message: 'User is not defined',
    });
  }
}
