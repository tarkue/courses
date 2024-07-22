import { IsDefined, IsEmail } from 'class-validator';
import { UpdatePasswordDTO } from './update.dto';

export class ResetPasswordDTO extends UpdatePasswordDTO {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  passwordResetToken: string;

  constructor({ password, email, passwordResetToken }: any = {}) {
    super(password);
    this.email = email;
    this.passwordResetToken = passwordResetToken;
  }
}
