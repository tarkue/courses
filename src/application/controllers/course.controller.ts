import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CourseService } from 'src/domain/services';
import { AuthGuard } from 'src/domain/guards';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthGuard)
  @Get()
  async get(@Req() req: Request): Promise<any> {
    return this.courseService.get(req['user'].email);
  }
}
