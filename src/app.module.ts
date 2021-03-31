import {
  Injectable,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { NextFunction, Request, Response } from 'express';
import { AppController } from './app.controller';
import { CommentModule } from './comments/comment.module';
import { UserModule } from './users/user.module';
import { PostModule } from './posts/post.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FilterModule } from './filter/filter.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
class RedirectToHTTPS implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.secure || process.env.NODE_ENV === 'development') {
      next();
    } else {
      res.redirect(`https://${req.get('host')}${req.originalUrl}`);
    }
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        user: configService.get<string>('MONGODB_USER'),
        pass: configService.get<string>('MONGODB_PASS'),
        dbName: configService.get<string>('MONGODB_NAME'),
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    AuthModule,
    CommentModule,
    UserModule,
    PostModule,
    FilterModule,
  ],
  controllers: [AppController],
  providers: [ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RedirectToHTTPS).forRoutes('*');
  }
}
