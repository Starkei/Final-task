import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { User } from '../mongoose/schema/user.schema';
import { extractValueFromUser, validateUser } from 'src/auth/request-user.util';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  BadRequestError,
  UnauthorizedError,
} from 'src/swagger-types/request-errors.types';
import {
  Profile,
  SwaggerProfileForUpdateDto,
} from 'src/swagger-types/profile.types';
import { FormDataToNumberPipe } from 'src/filter/filterDto-formatter.pipe';
import { ConvertFormDataToPostDto } from 'src/posts/convert-forms-data-to-array.pipe';
import { ProfileForUpdateDto } from './profile-for-update.dto';

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
  @ApiOkResponse({
    type: Profile,
    description: 'Return user object with post population',
  })
  @ApiBadRequestResponse({
    type: BadRequestError,
  })
  async getProfileById(@Param('userId') userId: string): Promise<User> {
    return this.profileService.getUserProfile(userId);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: Profile,
    description: 'Return user object with post population',
  })
  @ApiBadRequestResponse({
    type: BadRequestError,
  })
  @ApiUnauthorizedResponse({
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: SwaggerProfileForUpdateDto,
  })
  @ApiOkResponse({
    description: 'Return nothing and update user',
  })
  @ApiBadRequestResponse({
    type: BadRequestError,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedError,
  })
  @Put()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async changeAvatar(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body(
      new FormDataToNumberPipe(),
      new ConvertFormDataToPostDto(),
      new ValidationPipe({ transform: true }),
    )
    profileForUpdate: ProfileForUpdateDto,
  ): Promise<void> {
    return validateUser(req.user, () => {
      const email: string = (<User>req.user).email;
      return this.profileService.updateProfile(email, file, profileForUpdate);
    });
  }
}
