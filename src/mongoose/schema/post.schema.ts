/* eslint-disable prettier/prettier */
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Comment } from 'src/mongoose/schema/comment.schema';
import { User } from 'src/mongoose/schema/user.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  _id?: string;

  @Prop({
    required: true,
  })
  title!: string;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'User' }],
  })
  marks!: User[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  author!: User;

  @Prop({ type: String })
  image!: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Comment' }] })
  comments!: Comment[];

  @Prop()
  tags!: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
