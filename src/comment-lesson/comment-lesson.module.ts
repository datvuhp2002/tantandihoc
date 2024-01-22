import { Module } from '@nestjs/common';
import { CommentLessonController } from './comment-lesson.controller';
import { CommentLessonService } from './comment-lesson.service';
import { PrismaService } from 'src/prisma.servcie';

@Module({
  controllers: [CommentLessonController],
  providers: [CommentLessonService,PrismaService]
})
export class CommentLessonModule {}
