import { Injectable } from '@nestjs/common';
import { CourseRepository } from 'src/infrastructure/repositories';

import { courses } from 'src/courses';
import { Grades } from '../enums';

@Injectable()
export class CourseService {
  constructor(private courseRepository: CourseRepository) {}

  async get(email: string) {
    const grade = await this.courseRepository.getGrade(email);

    switch (grade) {
      case Grades.Beginner:
        return courses.slice(0, 4);
      case Grades.Intermediate:
        return courses.slice(0, 7);
      case Grades.Professional:
        return courses;
    }
  }
}
