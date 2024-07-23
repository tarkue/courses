import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { PASSWORD_OPTIONS } from '../options/password.options';

export class ResetPasswordDTO {
  @IsStrongPassword(PASSWORD_OPTIONS)
  password: string;
  @IsNotEmpty()
  passwordResetToken: string;

  constructor({ password, passwordResetToken }: any = {}) {
    this.password = password;
    this.passwordResetToken = passwordResetToken;
  }
}
