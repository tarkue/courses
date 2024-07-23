import { Injectable, UnauthorizedException } from '@nestjs/common';
import { validate } from 'class-validator';
import { CreateUserDTO, RegisterDTO, SignInDTO } from 'src/application/dto';
import { AuthRepository } from 'src/infrastructure/repositories';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { Grades } from '../enums';
import { getPasswordHash } from '../helpers/hash.helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
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

    registerDTO.password = await getPasswordHash(registerDTO.password);

    await this.authRepository.register(registerDTO);
  }

  async sendRegistrationLink(createUserDTO: CreateUserDTO): Promise<void> {
    const errors = await validate(createUserDTO);

    if (errors.length) throw errors;

    await this.authRepository.create(createUserDTO);
    this.mailService.sendRegisrationLink(createUserDTO);

    if (
      createUserDTO.grade == Grades.Intermediate ||
      createUserDTO.grade == Grades.Professional
    )
      this.mailService.sendTelegramLink(createUserDTO);
  }
}
