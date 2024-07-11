import { PrismaService } from 'src/prisma.service';
import { Module } from '@nestjs/common';
import { QuizAnswerController } from './quiz-answer.controller';
import { QuizAnswerService } from './quiz-answer.service';

@Module({
  controllers: [QuizAnswerController],
  providers: [QuizAnswerService, PrismaService],
})
export class QuizAnswerModule {}
