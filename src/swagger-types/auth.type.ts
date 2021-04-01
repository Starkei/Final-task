import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({
    required: true,
    description: 'Account email',
    format: 'email',
    type: String,
  })
  email!: string;

  @ApiProperty({
    required: true,
    description: 'Account email',
    minLength: 6,
    maxLength: 32,
    type: String,
  })
  password!: string;
}

export class JwtToken {
  @ApiProperty({ type: String, format: 'jwt-token', description: 'Auth token' })
  token!: string;
}
