import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from '@prisma/client';
import {
  CreateQuizDto,
  QuizFilterType,
  QuizPaginationResponseType,
  UpdateQuizDto,
} from './dto/quiz.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}
  @Delete('force-delete/:id')
  @Roles('Admin')
  forceDelete(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.delete(id);
  }
  @Delete('multiple-force-delete')
  @Roles('Admin')
  multipleForceDelete(@Body() ids: number[]) {
    return this.quizService.multipleForceDelete(ids);
  }
  @Delete('multiple-soft-delete')
  @Roles('Admin')
  multipleSoftDelete(@Body() ids: number[]) {
    return this.quizService.multipleSoftDelete(ids);
  }
  @Put('multiple-restore')
  @Roles('Admin')
  multipleRestore(@Body() ids: number[]) {
    return this.quizService.multipleRestore(ids);
  }
  @Put('restore/:id')
  @Roles('Admin')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.restore(id);
  }
  @Get('trash')
  @Roles('Admin')
  trash(@Query() filters: QuizFilterType): Promise<QuizPaginationResponseType> {
    return this.quizService.trash(filters);
  }
  @Get(':id')
  @Roles('Admin', 'User')
  getDetail(@Param('id', ParseIntPipe) id: number): Promise<Quiz> {
    return this.quizService.getDetail(id);
  }

  @Get('/get-all-quiz-in-lesson/:lesson_id')
  @Roles('Admin', 'User')
  getAllQuizInLesson(
    @Param('lesson_id', ParseIntPipe) lesson_id: number,
  ): Promise<Quiz[]> {
    return this.quizService.getAllQuizInLesson(lesson_id);
  }
  @Get()
  @Roles('Admin')
  getAll(
    @Query() filters: QuizFilterType,
  ): Promise<QuizPaginationResponseType> {
    return this.quizService.getAll(filters);
  }

  @Post()
  @Roles('Admin')
  create(@Body() data: CreateQuizDto): Promise<Quiz> {
    return this.quizService.create(data);
  }
  @Put(':id')
  @Roles('Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateQuizDto,
  ): Promise<Quiz> {
    return this.quizService.update(id, data);
  }
  @Delete(':id')
  @Roles('Admin')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.delete(id);
  }
}
