import { BadRequestException } from '@nestjs/common';

export function validateImageContent(imageContent: string) {
  if (!['image/jpeg', 'image/png'].includes(imageContent))
    throw new BadRequestException({
      contentType: imageContent,
      message: 'Invalid content-type',
    });
}
