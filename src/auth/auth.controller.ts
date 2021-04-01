import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request as Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserDto } from 'src/users/user.dto';
import { User } from 'src/mongoose/schema/user.schema';
import { UserService } from 'src/users/user.service';
import { AuthService } from './auth.service';
import { extractValueFromUser, validateUser } from './request-user.util';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOAuth2,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthLoginDto, JwtToken } from 'src/swagger-types/auth.type';
import {
  BadRequestError,
  UnauthorizedError,
} from 'src/swagger-types/request-errors.types';
import { Profile } from 'src/swagger-types/profile.types';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authSerice: AuthService,
  ) {}

  @ApiBody({ type: AuthLoginDto })
  @ApiCreatedResponse({ type: JwtToken, description: 'Return jwt token' })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiUnauthorizedResponse({ type: UnauthorizedError })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    return validateUser<Promise<{ token: string }>>(req.user, async () => {
      const email: string = extractValueFromUser<User>(req.user, 'email');
      const user: User = await this.userService.getUserByEmail(email);
      if (!user._id)
        throw new BadRequestException({
          userId: user._id,
          message: 'Invalid user id',
        });
      const token: string = await this.authSerice.login(email, user._id);
      return { token };
    });
  }

  @ApiBody({ type: AuthLoginDto })
  @ApiCreatedResponse({ type: Profile })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiUnauthorizedResponse({ type: UnauthorizedError })
  @Post('registrate')
  registrate(@Body() userDto: UserDto): Promise<User> {
    return this.userService.reqistrateUser(userDto);
  }

  @ApiCreatedResponse({ type: JwtToken, description: 'Return jwt token' })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiUnauthorizedResponse({ type: UnauthorizedError })
  @Post('/facebook/login')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin(@Req() req: Request) {
    return { status: HttpStatus.CREATED, data: req.user };
  }

  @ApiCreatedResponse({ type: JwtToken, description: 'Return jwt token' })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiUnauthorizedResponse({ type: UnauthorizedError })
  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginRedirect(@Req() req: Request) {
    return validateUser<{ token: string }>(req.user, () => {
      const token: string = <string>req.user;
      return { token };
    });
  }
}
