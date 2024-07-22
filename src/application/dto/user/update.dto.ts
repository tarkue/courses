import {
  IsDefined,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePasswordDTO {
  @IsDefined()
  @MinLength(8)
  @IsStrongPassword()
  @MaxLength(100)
  password: string;

  constructor({ password }: any = {}) {
    this.password = password;
  }
}
