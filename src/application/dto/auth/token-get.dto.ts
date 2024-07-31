import { IsNotEmpty } from 'class-validator';

export class TokenGetDTO {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  refreshToken: string;

  constructor({ token, refreshToken }: any = {}) {
    this.token = token;
    this.refreshToken = refreshToken;
  }
}
