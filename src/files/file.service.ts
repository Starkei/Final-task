import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { writeFile, unlink, stat, readFile } from 'fs/promises';
import { extname, join, basename } from 'path';
import { v4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageFile, ImageFileDocument } from 'src/mongoose/schema/file.shema';
import { validateImageContent } from 'src/validators/validate-image-type.util';

type URL = string;

export type Image = {
  mimetype: string;
  originalname: string;
  buffer: Buffer;
};
@Injectable()
export class FileService {
  constructor(
    @InjectModel(ImageFile.name)
    private readonly imageModel: Model<ImageFileDocument>,
  ) {}

  getContentType(fileName: string): string {
    const mapExtToContentType: Map<string, string> = new Map<string, string>([
      ['.png', 'image/png'],
      ['.jpg', 'image/jpeg'],
      ['.jpeg', 'image/jpeg'],
    ]);
    const ext: string = extname(basename(fileName));
    const contentType: string | undefined = mapExtToContentType.get(ext);
    if (contentType) return contentType;
    throw new BadRequestException({
      fileName,
      message: 'File is not an image',
    });
  }

  async isFileExists(filePath: string): Promise<boolean> {
    try {
      await stat(filePath);
      return true;
    } catch {
      return false;
    }
  }

  getImagePath(imageName: string): string {
    return join(__dirname, '../..', 'public', imageName);
  }

  async storeImage(image: Image): Promise<URL> {
    validateImageContent(image.mimetype);
    const extName: string = extname(image.originalname);
    const fileName: string = v4() + extName;
    const path: string = this.getImagePath(fileName);
    await writeFile(path, image.buffer, { encoding: 'base64' });
    await this.imageModel.create({
      image: { buffer: image.buffer, contentType: image.mimetype },
      imageName: fileName,
    });
    return fileName;
  }

  async removeImage(imageName: string): Promise<void> {
    const path: string = this.getImagePath(imageName);
    const fileExistend: boolean = await this.isFileExists(path);
    const fileInDb: ImageFileDocument | null = await this.imageModel.findOne({
      imageName,
    });
    if (fileExistend) {
      await unlink(path);
    }
    if (fileInDb) {
      await fileInDb.delete();
    }
  }

  async getImage(imageName: string): Promise<Image> {
    const path: string = this.getImagePath(imageName);
    const fileExistend: boolean = await this.isFileExists(path);
    const fileInDb: ImageFileDocument | null = await this.imageModel.findOne({
      imageName,
    });
    if (fileExistend) {
      readFile(path);
      const buffer: Buffer = await readFile(path);
      const contentType: string = this.getContentType(imageName);
      return { buffer, mimetype: contentType, originalname: imageName };
    } else if (fileInDb) {
      const path: string = this.getImagePath(fileInDb.imageName);
      await writeFile(path, fileInDb.image.buffer, { encoding: 'base64' });
      return {
        buffer: fileInDb.image.buffer,
        mimetype: fileInDb.image.contentType,
        originalname: fileInDb.imageName,
      };
    }
    throw new BadRequestException({ imageName, message: 'Image not exist' });
  }
}
