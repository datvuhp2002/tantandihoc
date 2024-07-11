import { Injectable } from '@nestjs/common';
import { Quiz, QuizAnswer } from '@prisma/client';
import {
  CreateQuizAnswerDto,
  UpdateQuizAnswerDto,
} from './dto/quiz-answer.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class QuizAnswerService {
  constructor(private prismaService: PrismaService) {}
  async update(id: number, data: UpdateQuizAnswerDto) {
    await this.prismaService.quizAnswer.update({ where: { id }, data });
  }
  async create(data: CreateQuizAnswerDto): Promise<QuizAnswer> {
    return await this.prismaService.quizAnswer.create({
      data: { ...data, quiz_id: Number(data.quiz_id) },
    });
  }
  async detail(id: number): Promise<QuizAnswer> {
    return await this.prismaService.quizAnswer.findUnique({
      where: { id },
    });
  }
  async getAllAnswerInQuiz(quiz_id: number): Promise<QuizAnswer[]> {
    return await this.prismaService.quizAnswer.findMany({
      where: { quiz_id },
      include: { ownership_quiz: true },
    });
  }
}
