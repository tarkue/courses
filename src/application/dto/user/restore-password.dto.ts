import { IsEmail } from 'class-validator';

export class RestorePasswordDTO {
  @IsEmail()
  email: string;

  constructor({ email }: any = {}) {
    this.email = email;
  }
}
