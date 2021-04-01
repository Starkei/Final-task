import { BadRequestException } from '@nestjs/common';
import { writeFile, unlink, stat, readFile } from 'fs/promises';
import { extname, join, basename } from 'path';
import { v4 } from 'uuid';

import { validateImageContent } from './validators/validate-image-type.util';
type URL = string;

export type Image = {
  mimetype: string;
  originalname: string;
  buffer: Buffer;
};

export function getContentType(fileName: string): string {
  const mapExtToContentType: Map<string, string> = new Map<string, string>([
    ['.png', 'image/png'],
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
  ]);
  const ext: string = extname(basename(fileName));
  const contentType: string | undefined = mapExtToContentType.get(ext);
  if (contentType) return contentType;
  throw new BadRequestException({ fileName, message: 'File is not an image' });
}

export async function isFileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export function getImagePath(imageName: string): string {
  return join(__dirname, '..', 'public', imageName);
}

export async function storeImage(image: Image): Promise<URL> {
  validateImageContent(image.mimetype);
  const extName: string = extname(image.originalname);
  const fileName: string = v4() + extName;
  const path: string = getImagePath(fileName);
  await writeFile(path, image.buffer, { encoding: 'base64' });
  return fileName;
}

export async function removeImage(imageName: string): Promise<void> {
  const path: string = getImagePath(imageName);
  const fileExistend: boolean = await isFileExists(path);
  if (fileExistend) {
    return unlink(path);
  }
}

export async function getImage(imageName: string): Promise<Image> {
  const path: string = getImagePath(imageName);
  const fileExistend: boolean = await isFileExists(path);
  if (fileExistend) {
    readFile(path);
    const buffer: Buffer = await readFile(path);
    const contentType: string = getContentType(imageName);
    return { buffer, mimetype: contentType, originalname: imageName };
  }
  throw new BadRequestException({ imageName, message: 'Image not exist' });
}
