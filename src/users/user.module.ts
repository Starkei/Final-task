import { Module } from '@nestjs/common';
import { PostService } from 'src/posts/post.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserService } from './user.service';
import { MongoModule } from 'src/mongoose/mongo.module';

@Module({
  imports: [MongoModule],
  controllers: [ProfileController],
  providers: [UserService, PostService, ProfileService],
  exports: [UserService],
})
export class UserModule {}
