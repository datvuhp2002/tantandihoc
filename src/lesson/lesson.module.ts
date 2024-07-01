import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [LessonController],
  providers: [LessonService, PrismaService, ConfigService, CloudinaryService],
})
export class LessonModule {}
