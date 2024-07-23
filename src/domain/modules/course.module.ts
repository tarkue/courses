import { Module } from '@nestjs/common';
import { CourseService } from '../services';
import { CourseController } from '../../application/controllers';
import { OrmModule } from '../../infrastructure/database/orm';
import { UserSchema } from '../entities';
import { CourseRepository } from '../../infrastructure/repositories';
import { Entities } from '../enums/entitites.enum';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    OrmModule.forFeature([{ name: Entities.User, schema: UserSchema }]),
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseRepository, JwtService],
  exports: [CourseService, CourseRepository],
})
export class CourseModule {}
