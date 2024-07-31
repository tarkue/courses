import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  EMAIL,
  HASHED_PASSWORD,
  IUser,
  UserDocument,
} from '../../domain/entities';
import {
  CreateUserDTO,
  RefreshTokenDTO,
  RegisterDTO,
  SignInDTO,
} from 'src/application/dto';
import { Entities } from '../../domain/enums';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(Entities.User) private readonly userModel: Model<UserDocument>,
  ) {}

  async getHashedPasswordByEmail({ email }: SignInDTO): Promise<string> {
    const { hashedPassword } = await this.userModel
      .findOne({ email: email })
      .select(HASHED_PASSWORD)
      .exec();

    return hashedPassword;
  }

  async create({ email, grade }: CreateUserDTO): Promise<IUser> {
    const result: IUser = await this.userModel.create({
      email: email,
      grade: grade,
    });
    return result;
  }

  async register({ email, password }: RegisterDTO): Promise<void> {
    await this.userModel
      .updateOne({ email: email }, { $set: { hashedPassword: password } })
      .exec();
  }

  async addRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.userModel
      .updateOne({ email: email }, { $set: { refreshToken: refreshToken } })
      .exec();
  }

  async getEmailByRefreshToken(
    refreshTokenDTO: RefreshTokenDTO,
  ): Promise<string> {
    const { email } = await this.userModel
      .findOne({ refreshToken: refreshTokenDTO.refreshToken })
      .select(EMAIL)
      .exec();
    return email;
  }
}
