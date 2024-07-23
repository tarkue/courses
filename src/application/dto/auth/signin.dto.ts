import { IsEmail, MinLength } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;

  constructor({ email, password }: any = {}) {
    this.email = email;
    this.password = password;
  }
}
