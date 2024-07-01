import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CourseReceivedService } from './course-received.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CourseReceived } from '@prisma/client';
import {
  CourseReceivedFilterType,
  CourseReceivedPaginationResponseType,
  createCourseReceivedDto,
} from './dto/course-received.dto';
@Controller('course-received')
export class CourseReceivedController {
  constructor(private courseReceivedService: CourseReceivedService) {}
  @Post()
  @Roles('Admin')
  create(@Body() data: createCourseReceivedDto): Promise<CourseReceived> {
    return this.courseReceivedService.create({
      ...data,
    });
  }
  @Get(':id')
  @Roles('Admin', 'User')
  getAllCourseRecivedFromCourse(
    @Param('id', ParseIntPipe) id: number,
    @Query() params: CourseReceivedFilterType,
  ): Promise<CourseReceivedPaginationResponseType> {
    return this.courseReceivedService.getAll(id, params);
  }
}
