import { IsStrongPasswordOptions } from 'class-validator';

export const PASSWORD_OPTIONS: IsStrongPasswordOptions = {
  minLength: 6,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 0,
} as const;
