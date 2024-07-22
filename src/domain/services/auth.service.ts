import {
  Injectable,
  MethodNotAllowedException,
  UnauthorizedException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateUserDTO, RegisterDTO, SignInDTO } from 'src/application/dto';
import { AuthRepository } from 'src/infrastructure/repositories';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppConfig, EnvObjects } from 'src/infrastructure/config/env.objects';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async signIn(signInDTO: SignInDTO): Promise<string> {
    const errors = await validate(signInDTO);

    if (errors.length) throw errors;

    const hashedPassword =
      await this.authRepository.getHashedPasswordByEmail(signInDTO);

    const compare = await bcrypt.compare(signInDTO.password, hashedPassword);

    if (!compare) throw new UnauthorizedException();

    return await this.jwtService.signAsync({ email: signInDTO.email });
  }

  async register(registerDTO: RegisterDTO): Promise<void> {
    const errors = await validate(registerDTO);

    if (errors.length) throw errors;

    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(registerDTO.password, salt);
    registerDTO.password = hashed_password;

    await this.authRepository.register(registerDTO);
  }

  async sendRegistrationLink(createUserDTO: CreateUserDTO): Promise<void> {
    const errors = await validate(createUserDTO);

    if (errors.length) throw errors;

    const config = this.configService.get<AppConfig>(EnvObjects.APP_CONFIG);

    if (!config || createUserDTO.admin_key != config.admin_key)
      throw new MethodNotAllowedException();

    await this.authRepository.create(createUserDTO);

    this.mailService.sendRegisrationLink(createUserDTO);
  }
}
