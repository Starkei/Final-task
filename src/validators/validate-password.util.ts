import { BadRequestException } from '@nestjs/common';

export function validatePassword(password: string) {
  if (password.length < 6)
    throw new BadRequestException({ message: 'Password is to small' });
  if (password.length > 32)
    throw new BadRequestException({ message: 'Password is to long' });
}
