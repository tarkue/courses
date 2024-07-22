import { IsDefined, IsEmail, MaxLength, MinLength } from 'class-validator';

export class SignInDTO {
  @IsDefined()
  @IsEmail()
  email: string;
  @IsDefined()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  constructor({ email, password }: any = {}) {
    this.email = email;
    this.password = password;
  }
}
