import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EMAIL, UserDocument } from '../../domain/entities';
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

  async updatePassword(
    email: string,
    { password }: UpdatePasswordDTO,
  ): Promise<void> {
    await this.userModel
      .updateOne({ email: email }, { $set: { hashedPassword: password } })
      .exec();
  }

  async upgrade({ email, grade }: UpgradeDTO): Promise<void> {
    await this.userModel
      .updateOne({ email: email }, { $set: { grade: grade } })
      .exec();
  }

  async setPasswordResetToken(
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

  async getEmailByResetToken({
    passwordResetToken,
  }: ResetPasswordDTO): Promise<string> {
    const { email } = await this.userModel
      .findOne({ passwordResetToken: passwordResetToken })
      .select(EMAIL)
      .exec();

    return email;
  }
}
