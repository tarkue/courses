import { IsDefined, IsEmail, IsEnum } from 'class-validator';
import { Grades } from 'src/domain/enums';

export class UpgradeDTO {
  @IsDefined()
  @IsEmail()
  email: string;
  @IsDefined()
  @IsEnum(Grades)
  grade: Grades;
  @IsDefined()
  admin_key: string;

  constructor({ grade }: any = {}) {
    this.grade = grade;
  }
}
