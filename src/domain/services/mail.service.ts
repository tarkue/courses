import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvObjects, SMTPConfig } from 'src/infrastructure/config/env.objects';
import { RestorePasswordDTO, CreateUserDTO } from 'src/application/dto';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendRegisrationLink(createUserDTO: CreateUserDTO) {
    const config = this.getConfig();
    const url = `${config.data.registrationEndpoint}${createUserDTO.email}`;

    await this.mailerService.sendMail({
      to: createUserDTO.email,
      subject: 'Welcome to Nice App!',
      template: './registration',
      context: {
        url,
      },
    });
  }

  async sendPasswordRestoreLink(
    passwordResetToken: string,
    { email }: RestorePasswordDTO,
  ) {
    const config = this.getConfig();
    const url = `${config.data.passwordResetEndpoint}${passwordResetToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Nice App!',
      template: './password-reset',
      context: {
        url,
      },
    });
  }

  private getConfig() {
    return this.configService.get<SMTPConfig>(EnvObjects.SMTP_OPTIONS);
  }
}
