import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../../domain/entities';
import {
  ResetPasswordDTO,
  RestorePasswordDTO,
  UpdatePasswordDTO,
  UpgradeDTO,
} from 'src/application/dto';
import { Entities } from '../../domain/enums';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(Entities.User) private readonly userModel: Model<UserDocument>,
  ) {}

  async update(email: string, { password }: UpdatePasswordDTO): Promise<void> {
    await this.userModel
      .updateOne({ email: email }, { $set: { hashedPassword: password } })
      .exec();
  }

  async upgrade({ email, grade }: UpgradeDTO): Promise<void> {
    await this.userModel
      .updateOne({ email: email }, { $set: { grade: grade } })
      .exec();
  }

  async addPasswordResetToken(
    passwordResetToken: string,
    { email }: RestorePasswordDTO,
  ): Promise<void> {
    await this.userModel
      .updateOne(
        { email: email },
        { $set: { passwordResetToken: passwordResetToken } },
      )
      .exec();
  }

  async getPasswordResetToken({ email }: ResetPasswordDTO) {
    const { passwordResetToken } = await this.userModel
      .findOne({ email: email })
      .select('passwordResetToken')
      .exec();

    return passwordResetToken;
  }
}
