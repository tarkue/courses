import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateUserDTO, RegisterDTO, SignInDTO } from 'src/application/dto';
import { AuthRepository } from 'src/infrastructure/repositories';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { Grades } from '../enums';
import { getPasswordHash } from '../helpers';
import { RefreshTokenDTO, TokenGetDTO } from 'src/application/dto/auth';
import { generateHex } from '../helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signIn(signInDTO: SignInDTO): Promise<TokenGetDTO> {
    const errors = await validate(signInDTO);

    if (errors.length) throw errors;

    const hashedPassword =
      await this.authRepository.getHashedPasswordByEmail(signInDTO);

    const compare = await bcrypt.compare(signInDTO.password, hashedPassword);

    if (!compare) throw new UnauthorizedException();

    return await this.getTokenAndRefreshToken(signInDTO.email);
  }

  async register(registerDTO: RegisterDTO): Promise<void> {
    const errors = await validate(registerDTO);

    if (errors.length) throw errors;

    registerDTO.password = await getPasswordHash(registerDTO.password);

    await this.authRepository.register(registerDTO);
  }

  async refreshToken(refreshTokenDTO: RefreshTokenDTO): Promise<TokenGetDTO> {
    const errors = await validate(refreshTokenDTO);
    if (errors.length) throw errors;

    try {
      const email =
        await this.authRepository.getEmailByRefreshToken(refreshTokenDTO);
      return await this.getTokenAndRefreshToken(email);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async sendRegistrationLink(createUserDTO: CreateUserDTO): Promise<void> {
    const errors = await validate(createUserDTO);

    if (errors.length) throw errors;

    try {
      await this.authRepository.create(createUserDTO);
    } catch {
      throw new BadRequestException('User with this email already exists');
    }
    this.mailService.sendRegisrationLink(createUserDTO);

    if (
      createUserDTO.grade == Grades.Intermediate ||
      createUserDTO.grade == Grades.Professional
    )
      this.mailService.sendTelegramLink(createUserDTO);
  }

  private async getTokenAndRefreshToken(email: string): Promise<TokenGetDTO> {
    const token = await this.jwtService.signAsync({ email: email });
    const refreshToken = generateHex();

    this.authRepository.addRefreshToken(email, refreshToken);
    return new TokenGetDTO({ token, refreshToken });
  }
}
