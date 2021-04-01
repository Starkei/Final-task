import { BadRequestException } from '@nestjs/common';
import { validate } from 'isemail';

export function validateEmail(email: string) {
  if (!validate(email))
    throw new BadRequestException({
      email,
      message: 'Invalid email',
    });
}
