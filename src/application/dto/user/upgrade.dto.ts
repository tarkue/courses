import { IsEmail, IsEnum } from 'class-validator';
import { Grades } from 'src/domain/enums';

export class UpgradeDTO {
  @IsEmail()
  email: string;
  @IsEnum(Grades)
  grade: Grades;

  constructor({ grade, email }: any = {}) {
    this.email = email;
    this.grade = grade;
  }
}
