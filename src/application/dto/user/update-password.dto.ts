import { IsStrongPassword } from 'class-validator';
import { PASSWORD_OPTIONS } from '../options/password.options';

export class UpdatePasswordDTO {
  @IsStrongPassword(PASSWORD_OPTIONS)
  password: string;

  constructor({ password }: any = {}) {
    this.password = password;
  }
}
