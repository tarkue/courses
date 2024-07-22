import { IsDefined, IsEmail } from 'class-validator';

export class RestorePasswordDTO {
  @IsDefined()
  @IsEmail()
  email: string;

  constructor({ email }: any = {}) {
    this.email = email;
  }
}
