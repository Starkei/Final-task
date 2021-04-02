import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type ImageFileDocument = ImageFile & Document;

@Schema()
export class ImageFile {
  _id?: string;
  @Prop({ type: String, unique: true })
  imageName!: string;

  @Prop(raw({ buffer: SchemaTypes.Buffer, contentType: String }))
  image!: { buffer: Buffer; contentType: string };
}

export const ImageSchema = SchemaFactory.createForClass(ImageFile);
