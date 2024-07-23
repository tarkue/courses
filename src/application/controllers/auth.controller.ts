import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/domain/services';
import { CreateUserDTO, SignInDTO, RegisterDTO } from '../dto';
import { TokenGetDTO } from '../dto/auth/token-get.dto';
import { AdminGuard } from 'src/domain/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  async signIn(@Body() signInDTO: SignInDTO): Promise<TokenGetDTO> {
    const dto = new SignInDTO(signInDTO);
    const token = await this.authService.signIn(dto);
    return new TokenGetDTO({ token });
  }

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO): Promise<void> {
    const dto = new RegisterDTO(registerDTO);
    await this.authService.register(dto);
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
