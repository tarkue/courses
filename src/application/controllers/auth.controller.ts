import { Body, Controller, Post, UseGuards, Res, Req } from '@nestjs/common';
import { AuthService } from 'src/domain/services';
import { CreateUserDTO, SignInDTO, RegisterDTO } from '../dto';
import { AdminGuard } from 'src/domain/guards';
import { RefreshTokenDTO, TokenGetDTO } from '../dto/auth';
import { Request, Response } from 'express';
import { REFRESH_TOKEN } from 'src/domain/consts';

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
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<TokenGetDTO> {
    const dto = new RefreshTokenDTO(req.cookies[REFRESH_TOKEN]);
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
