import { writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { v4 } from 'uuid';

import { validateImageContent } from './validators/validate-image-type.util';
type URL = string;

type Image = {
  mimetype: string;
  originalname: string;
  buffer: Buffer;
};
export async function storeImage(image: Image): Promise<URL> {
  validateImageContent(image.mimetype);
  const extName: string = extname(image.originalname);
  const fileName: string = v4() + extName;
  const path: string = join(__dirname, '..', 'public', fileName);
  await writeFile(path, image.buffer, { encoding: 'base64' });
  return process.env.HOST_URL + '/' + fileName;
}
