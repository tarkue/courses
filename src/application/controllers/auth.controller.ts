import { Body, Controller, Post, UseGuards, Res } from '@nestjs/common';
import { AuthService } from 'src/domain/services';
import { CreateUserDTO, SignInDTO, RegisterDTO } from '../dto';
import { AdminGuard } from 'src/domain/guards';
import { RefreshTokenDTO, TokenGetDTO } from '../dto/auth';
import { Response } from 'express';
import { REFRESH_TOKEN } from 'src/domain/consts';
import { Cookies } from 'src/domain/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  async signIn(
    @Body() signInDTO: SignInDTO,
    @Res() res: Response,
  ): Promise<TokenGetDTO> {
    const dto = new SignInDTO(signInDTO);
    const answer = await this.authService.signIn(dto);

    return this.authService.sendTokenAndRefreshToken(res, answer);
  }

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO): Promise<void> {
    const dto = new RegisterDTO(registerDTO);
    await this.authService.register(dto);
  }

  @Post('refreshToken')
  async getRefreshToken(
    @Cookies(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ): Promise<TokenGetDTO> {
    const dto = new RefreshTokenDTO({ refreshToken });
    const answer = await this.authService.refreshToken(dto);

    return this.authService.sendTokenAndRefreshToken(res, answer);
  }

  @UseGuards(AdminGuard)
  @Post('createUser')
  async sendRegistrationLink(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<void> {
    const dto = new CreateUserDTO(createUserDTO);
    await this.authService.sendRegistrationLink(dto);
  }
}
