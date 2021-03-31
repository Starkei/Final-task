/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy } from 'passport-facebook';
import { User } from 'src/mongoose/schema/user.schema';
import { UserService } from 'src/users/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private configService: ConfigService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_SECRET_ID'),
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
      scope: 'email',
      profileFields: ['displayName', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToker: string,
    profile: Profile,
    done: (err: unknown, user: any, info?: any) => void,
  ): Promise<any> {
    //Extract profile data
    const { emails, displayName } = profile;

    //Validate if user has email continue, else throw badrequest
    if (!emails || (emails && emails.length === 0)) {
      done(
        new BadRequestException({ email: 'NONE', message: 'Email is empty' }),
        null,
      );
      return;
    }

    //Check user by his first email in emails
    const isUserExists: boolean = await this.userService.isUserExists(
      emails[0].value,
    );

    //Registrate new user if he not exist
    if (!isUserExists)
      await this.userService.reqistrateUser({
        email: emails[0].value,
        displayName,
      });

    const user: User = await this.userService.getUserByEmail(emails[0].value);
    if (!user._id) {
      done(
        new BadRequestException({ id: user._id, message: 'Invalid user id' }),
        null,
      );
      return;
    }
    //Return new jwt token
    const token: string = await this.authService.login(
      emails[0].value,
      user._id,
    );
    done(null, token);
  }
}
