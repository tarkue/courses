import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/repositories';
import { UpdatePasswordDTO, UpgradeDTO } from 'src/application/dto';
import { validate } from 'class-validator';
import { ResetPasswordDTO, RestorePasswordDTO } from 'src/application/dto/user';
import { MailService } from './mail.service';
import { generateHex } from '../helpers';
import { Grades } from '../enums';
import { getPasswordHash } from '../helpers/hash.helpers';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
  ) {}

  async updatePassword(email: string, updateDTO: UpdatePasswordDTO) {
    const errors = await validate(updateDTO);

    if (errors.length) throw errors;

    updateDTO.password = await getPasswordHash(updateDTO.password);

    await this.userRepository.updatePassword(email, updateDTO);
  }

  async upgrade(upgradeDTO: UpgradeDTO) {
    const errors = await validate(upgradeDTO);

    if (errors.length) throw errors;

    await this.userRepository.upgrade(upgradeDTO);

    if (
      upgradeDTO.grade == Grades.Intermediate ||
      upgradeDTO.grade == Grades.Professional
    )
      await this.mailService.sendTelegramLink(upgradeDTO);
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    const errors = await validate(resetPasswordDTO);

    if (errors.length) throw errors;

    try {
      const email =
        await this.userRepository.getEmailByResetToken(resetPasswordDTO);

      resetPasswordDTO.password = await getPasswordHash(
        resetPasswordDTO.password,
      );
      await this.userRepository.updatePassword(email, resetPasswordDTO);
      await this.userRepository.setPasswordResetToken(null, { email });
    } catch (error) {
      throw new UnprocessableEntityException('Wrong password reset token');
    }
  }

  async sendPasswordRestoreLink(restorePasswordDTO: RestorePasswordDTO) {
    const errors = await validate(restorePasswordDTO);

    if (errors.length) throw errors;

    const passwordResetToken = generateHex();

    await this.userRepository.setPasswordResetToken(
      passwordResetToken,
      restorePasswordDTO,
    );

    await this.mailService.sendPasswordRestoreLink(
      passwordResetToken,
      restorePasswordDTO,
    );
  }
}
