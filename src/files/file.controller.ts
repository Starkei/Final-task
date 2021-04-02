import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { validateImageContent } from 'src/validators/validate-image-type.util';
import { FileService, Image } from './file.service';

@Controller()
export class FileController {
  constructor(private readonly imageService: FileService) {}

  @Get(':imageName')
  async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    if (imageName) {
      const contentType: string = this.imageService.getContentType(imageName);
      validateImageContent(contentType);
      const image: Image = await this.imageService.getImage(imageName);
      const path: string = this.imageService.getImagePath(image.originalname);
      res.sendFile(path);
    } else
      throw new NotFoundException({ imageName, message: 'Message not found' });
  }
}
