import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Delete,
  ParseIntPipe,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UserProgressService } from './user-progress.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User, UserProgress } from '@prisma/client';
import {
  CreateUserProgressDto,
  UpdateUserProgressDto,
  UserProgressFilterType,
  UserProgressPaginationResponseType,
} from './dto/user-progress.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { getUser } from 'src/user/decorator/user.decorator';

@Controller('user-progress')
export class UserProgressController {
  constructor(private userProgressService: UserProgressService) {}
  @Get('/get-total-user-register-course/:id')
  @Roles('Admin', 'User')
  getTotalUserRegisterCourse(
    @Param('id', ParseIntPipe) course_id: number,
  ): Promise<any> {
    return this.userProgressService.getTotalUserRegisterCourse(course_id);
  }
  @Post()
  @Roles('Admin', 'User')
  create(
    @getUser() user: User,
    @Body() data: CreateUserProgressDto,
  ): Promise<UserProgress> {
    return this.userProgressService.create(
      (data = { ...data, author_id: Number(user.id) }),
    );
  }
  @Get('/user-course')
  @Roles('Admin', 'User')
  userCourse(@getUser() user: User): Promise<any> {
    return this.userProgressService.userCourse(user.id);
  }
  @Get('/detail/:id')
  @Roles('Admin', 'User')
  detail(
    @getUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserProgress> {
    return this.userProgressService.detail(user.id, id);
  }
  @Get('getAllLessonUserHasLearned/:id')
  @Roles('Admin', 'User')
  getAllLessonUserHasLearned(
    @getUser() user: User,
    @Param('id', ParseIntPipe) course_id: number,
  ): Promise<any> {
    return this.userProgressService.getAllLessonUserHasLearned(
      user.id,
      course_id,
    );
  }
  @Get('isDoneQuiz/:id')
  @Roles('Admin', 'User')
  isDoneQuiz(
    @getUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Query('lesson_id', ParseIntPipe) lesson_id: number,
    @Query('quiz_id', ParseIntPipe) quiz_id: number,
  ): Promise<Boolean> {
    return this.userProgressService.isDoneQuiz(user.id, id, lesson_id, quiz_id);
  }
  @Get('checkIsLearned/:id')
  @Roles('Admin', 'User')
  checkUserProgressByCourseIdLessonId(
    @getUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Query('lesson_id', ParseIntPipe) lesson_id: number,
  ): Promise<Boolean> {
    return this.userProgressService.checkIsLearned(user.id, id, lesson_id);
  }
  @Get(':id')
  @Roles('Admin', 'User')
  getUserProgressByCourseId(
    @getUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Boolean> {
    return this.userProgressService.getUserProgressByCourseId(user.id, id);
  }
  @Get()
  @Roles('Admin', 'User')
  getAll(
    @Query() data: UserProgressFilterType,
  ): Promise<UserProgressPaginationResponseType> {
    return this.userProgressService.getAll(data);
  }

  @Put(':id')
  @Roles('Admin', 'User')
  update(
    @getUser() user: User,
    @Param('id', ParseIntPipe) course_id: number,
    @Query('lesson_id', ParseIntPipe) lesson_id: number,
    @Body() data: UpdateUserProgressDto,
  ): Promise<UserProgress> {
    const author_id = Number(user.id);
    return this.userProgressService.update(
      author_id,
      course_id,
      lesson_id,
      data,
    );
  }
  @Delete(':id')
  @Roles('Admin', 'User')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userProgressService.delete(id);
  }
}
