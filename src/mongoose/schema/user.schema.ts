/* eslint-disable prettier/prettier */
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { validate as isEmail } from 'isemail';
import { Document, SchemaTypes } from 'mongoose';
import { Comment } from 'src/mongoose/schema/comment.schema';
import { Post } from 'src/mongoose/schema/post.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id?: string;
  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: function (email: string) {
        return isEmail(email);
      },
    },
  })
  email!: string;

  @Prop({
    required: false,
    unique: true,
  })
  displayName?: string;

  @Prop(raw({ data: { type: Buffer }, contentType: { type: String } }))
  avatar?: { data: Buffer; contentType: string };

  @Prop({
    required: false,
  })
  password?: string;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'Post' }],
  })
  posts!: Post[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Comment' }] })
  coments!: Comment[];
}

export const UserSchema = SchemaFactory.createForClass(User);
