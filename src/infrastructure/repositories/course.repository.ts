import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../../domain/entities';
import { Entities, Grades } from '../../domain/enums';

@Injectable()
export class CourseRepository {
  constructor(
    @InjectModel(Entities.User) private readonly userModel: Model<UserDocument>,
  ) {}

  async getGrade(email: string): Promise<Grades> {
    const { grade } = await this.userModel
      .findOne({ email: email })
      .select('grade')
      .exec();

    return grade;
  }
}
