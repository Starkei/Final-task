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

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authSerice: AuthService,
  ) {}

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
  @Post('registrate')
  registrate(@Body() userDto: UserDto): Promise<User> {
    return this.userService.reqistrateUser(userDto);
  }
  @Post('/facebook/login')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin(@Req() req: Request) {
    return { status: HttpStatus.CREATED, data: req.user };
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginRedirect(@Req() req: Request) {
    return validateUser<{ token: string }>(req.user, () => {
      const token: string = <string>req.user;
      return { token };
    });
  }
}
