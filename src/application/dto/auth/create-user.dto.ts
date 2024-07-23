import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Grades } from 'src/domain/enums';

export class CreateUserDTO {
  @IsEmail()
  email: string;
  @IsEnum(Grades)
  grade: Grades;
  @IsNotEmpty()
  admin_key: string;

  constructor({ email, grade, admin_key }: any = {}) {
    this.email = email;
    this.grade = grade;
    this.admin_key = admin_key;
  }
}
