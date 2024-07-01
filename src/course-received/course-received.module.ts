import { Module } from '@nestjs/common';
import { CourseReceivedController } from './course-received.controller';
import { CourseReceivedService } from './course-received.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CourseReceivedController],
  providers: [CourseReceivedService, PrismaService],
})
export class CourseReceivedModule {}
