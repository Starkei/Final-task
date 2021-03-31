/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Post } from 'src/mongoose/schema/post.schema';
import { User } from 'src/mongoose/schema/user.schema';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  _id?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Post' })
  post!: Post;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  author!: User;

  @Prop()
  content!: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
