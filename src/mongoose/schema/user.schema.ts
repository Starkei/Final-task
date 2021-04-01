/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { validate as isEmail } from 'isemail';
import { Document, SchemaTypes, VirtualType } from 'mongoose';
import { Comment } from 'src/mongoose/schema/comment.schema';
import { Post } from 'src/mongoose/schema/post.schema';

export type UserDocument = User & Document;
@Schema({ toJSON: { virtuals: true } })
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

  @Prop({
    type: String,
  })
  avatar?: string;

  avatarUrl?: string;

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

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.virtual('avatarUrl').get(function (this: UserDocument) {
  if (this.avatar) return process.env.HOST_URL + '/' + this.avatar;
  return 'EMPTY';
});
export { UserSchema };
