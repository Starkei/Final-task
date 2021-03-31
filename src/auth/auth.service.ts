import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'src/mongoose/schema/user.schema';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.userService.getUserByEmail(email);
    if (!user.password)
      throw new UnauthorizedException({
        email,
        message: 'User with this email should login throught facebook',
      });
    const isEqual: boolean = await compare(password, user.password);
    if (isEqual)
      return { email: user.email, coments: user.coments, posts: user.posts };
    throw new UnauthorizedException({ email, message: 'Invalid password' });
  }
  async login(email: string, userId: string): Promise<string> {
    const access_token: string = await this.jwtService.signAsync({
      email,
      id: userId,
    });
    return access_token;
  }
}
