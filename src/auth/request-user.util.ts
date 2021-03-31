import { UnauthorizedException } from '@nestjs/common';

export function validateUser<ReturnValue = void>(
  user: Express.User | undefined,
  callback: () => ReturnValue,
): ReturnValue {
  if (user) {
    return callback();
  }
  throw new UnauthorizedException({
    user,
    message: 'User is not defined',
  });
}

export function extractValueFromUser<
  UserWraper extends { [key: string]: any },
  ValueType = any
>(user: Express.User | undefined, fieldName: string): ValueType {
  return (<UserWraper>user)[fieldName];
}
