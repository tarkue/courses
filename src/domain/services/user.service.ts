import { JwtService } from '@nestjs/jwt';
import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/repositories';
import { UpdatePasswordDTO, UpgradeDTO } from 'src/application/dto';
import { validate } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { AppConfig, EnvObjects } from 'src/infrastructure/config/env.objects';
import { ResetPasswordDTO, RestorePasswordDTO } from 'src/application/dto/user';
import { MailService } from './mail.service';
import { generateHex } from '../helpers';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async updatePassword(token: string, updateDTO: UpdatePasswordDTO) {
    const payload = await this.jwtService.verifyAsync(token);
    const errors = await validate(updateDTO);

    if (errors.length) throw errors;

    await this.userRepository.update(payload.email, updateDTO);
  }

  async upgrade(upgradeDTO: UpgradeDTO) {
    const config = this.configService.get<AppConfig>(EnvObjects.APP_CONFIG);
    const errors = await validate(upgradeDTO);

    if (errors.length) throw errors;
    if (config.admin_key !== upgradeDTO.admin_key)
      throw new MethodNotAllowedException();

    await this.userRepository.upgrade(upgradeDTO);
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    const errors = await validate(resetPasswordDTO);

    if (errors.length) throw errors;

    const passwordResetToken =
      await this.userRepository.getPasswordResetToken(resetPasswordDTO);

    if (passwordResetToken != resetPasswordDTO.passwordResetToken)
      throw new MethodNotAllowedException();

    await this.userRepository.update(resetPasswordDTO.email, {
      password: resetPasswordDTO.password,
    });
  }

  async sendPasswordRestoreLink(restorePasswordDTO: RestorePasswordDTO) {
    const errors = await validate(restorePasswordDTO);

    if (errors) throw errors;

    const passwordResetToken = generateHex();

    await this.userRepository.addPasswordResetToken(
      passwordResetToken,
      restorePasswordDTO,
    );

    await this.mailService.sendPasswordRestoreLink(
      passwordResetToken,
      restorePasswordDTO,
    );
  }
}
