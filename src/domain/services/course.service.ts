import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { CourseRepository } from 'src/infrastructure/repositories';
import { JWTPayload } from '../interfaces';
import { courses } from 'src/courses';

@Injectable()
export class CourseService {
  constructor(
    private courseRepository: CourseRepository,
    private jwtService: JwtService,
  ) {}

  async get(token: string) {
    const payload = await this.jwtService.verifyAsync<JWTPayload>(token);
    const grade = await this.courseRepository.getGrade(payload.email);

    return courses.slice(0, grade);
  }
}
