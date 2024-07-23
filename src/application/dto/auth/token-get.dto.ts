import { IsNotEmpty } from 'class-validator';

export class TokenGetDTO {
  @IsNotEmpty()
  token: string;

  constructor({ token }: any = {}) {
    this.token = token;
  }
}
