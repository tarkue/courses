import { IsDefined, IsEmail } from 'class-validator';
import { Grades } from 'src/domain/enums';

export class CreateUserDTO {
  @IsDefined()
  @IsEmail()
  email: string;
  @IsDefined()
  grade: Grades;
  @IsDefined()
  admin_key: string;

  constructor({ email, grade, admin_key }: any = {}) {
    this.email = email;
    this.grade = grade;
    this.admin_key = admin_key;
  }
}
