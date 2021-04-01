/* eslint-disable prettier/prettier */
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { validate as isEmail } from 'isemail';
import { Document, SchemaTypes } from 'mongoose';
import { Comment } from 'src/mongoose/schema/comment.schema';
import { Post } from 'src/mongoose/schema/post.schema';

export type UserDocument = User & Document;
class Image {
  @ApiProperty()
  data!: Buffer;

  @ApiProperty()
  contentType!: string;
}
@Schema()
export class User {
  @ApiPropertyOptional()
  _id?: string;

  @ApiProperty({ required: true, uniqueItems: true, format: 'email' })
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

  @ApiPropertyOptional({ uniqueItems: true })
  @Prop({
    required: false,
    unique: true,
  })
  displayName?: string;

  @ApiPropertyOptional({ type: Image })
  @Prop(raw({ data: { type: Buffer }, contentType: { type: String } }))
  avatar?: { data: Buffer; contentType: string };

  @Prop({
    required: false,
  })
  password?: string;

  @ApiProperty({ type: Post, isArray: true })
  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'Post' }],
  })
  posts!: Post[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Comment' }] })
  coments!: Comment[];
}

export const UserSchema = SchemaFactory.createForClass(User);
