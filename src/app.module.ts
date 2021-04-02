import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CommentModule } from './comments/comment.module';
import { UserModule } from './users/user.module';
import { PostModule } from './posts/post.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FilterModule } from './filter/filter.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileModule } from './files/file.module';

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
    FileModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
