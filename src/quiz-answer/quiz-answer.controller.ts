import { Roles } from 'src/auth/decorator/roles.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { QuizAnswerService } from './quiz-answer.service';
import {
  CreateQuizAnswerDto,
  UpdateQuizAnswerDto,
} from './dto/quiz-answer.dto';
import { QuizAnswer } from '@prisma/client';

@Controller('quiz-answer')
export class QuizAnswerController {
  constructor(private quizAnswerService: QuizAnswerService) {}
  @Post()
  @Roles('Admin')
  create(@Body() data: CreateQuizAnswerDto): Promise<QuizAnswer> {
    return this.quizAnswerService.create(data);
  }
  @Put(':id')
  @Roles('Admin')
  update(
    @Body() data: UpdateQuizAnswerDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.quizAnswerService.update(id, data);
  }
  @Get(':id')
  @Roles('Admin', 'User')
  detail(@Param('id', ParseIntPipe) id: number): Promise<QuizAnswer> {
    return this.quizAnswerService.detail(id);
  }

  @Get('/getAllAnswerInQuiz/:id')
  @Roles('Admin', 'User')
  getAllAnswerInQuiz(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<QuizAnswer[]> {
    return this.quizAnswerService.getAllAnswerInQuiz(id);
  }
}
