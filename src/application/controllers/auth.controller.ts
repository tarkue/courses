import { Body, Controller, Post, UseGuards, Response } from '@nestjs/common';
import { AuthService } from 'src/domain/services';
import { CreateUserDTO, SignInDTO, RegisterDTO } from '../dto';
import { AdminGuard } from 'src/domain/guards';
import { getExpiresDate } from 'src/domain/helpers';
import { RefreshTokenDTO, TokenGetDTO } from '../dto/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  async signIn(
    @Body() signInDTO: SignInDTO,
    @Response() res,
  ): Promise<TokenGetDTO> {
    const dto = new SignInDTO(signInDTO);
    const answer = await this.authService.signIn(dto);

    res.cookie('refreshToken', answer.refreshToken, {
      expires: getExpiresDate(30),
      sameSite: 'strict',
      httpOnly: true,
    });

    return answer;
  }

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO): Promise<void> {
    const dto = new RegisterDTO(registerDTO);
    await this.authService.register(dto);
  }

  @Post('refreshToken')
  async refreshToken(
    @Body() refreshTokenDTO: RefreshTokenDTO,
  ): Promise<TokenGetDTO> {
    const dto = new RefreshTokenDTO(refreshTokenDTO);
    return await this.authService.refreshToken(dto);
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
