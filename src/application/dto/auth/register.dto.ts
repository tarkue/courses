import { IsEmail, IsStrongPassword } from 'class-validator';
import { PASSWORD_OPTIONS } from '../options/password.options';

export class RegisterDTO {
  @IsEmail()
  email: string;
  @IsStrongPassword(PASSWORD_OPTIONS)
  password: string;

  constructor({ email, password }: any = {}) {
    this.email = email;
    this.password = password;
  }
}
