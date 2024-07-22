import {
  IsDefined,
  IsEmail,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @IsDefined()
  @IsEmail()
  email: string;
  @IsDefined()
  @MinLength(8)
  @MaxLength(100)
  @IsStrongPassword()
  password: string;

  constructor({ email, password }: any = {}) {
    this.email = email;
    this.password = password;
  }
}
