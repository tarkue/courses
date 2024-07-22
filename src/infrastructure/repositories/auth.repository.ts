import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, UserDocument } from '../../domain/entities';
import { CreateUserDTO, RegisterDTO, SignInDTO } from 'src/application/dto';
import { Entities } from '../../domain/enums';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(Entities.User) private readonly userModel: Model<UserDocument>,
  ) {}

  async getHashedPasswordByEmail({ email }: SignInDTO): Promise<string> {
    const { hashedPassword } = await this.userModel
      .findOne({ email: email })
      .select('hashedPassword')
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
}
