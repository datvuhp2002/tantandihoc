import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Lesson, Course } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateLessonDto,
  LessonFilterType,
  LessonPaginationResponseType,
  UpdateLessonDto,
} from './dto/lesson.dto';

@Injectable()
export class LessonService {
  constructor(private prismaService: PrismaService) {}
  async getAll(
    filters: LessonFilterType,
  ): Promise<LessonPaginationResponseType> {
    const getAll = filters.get_all;
    const course_id = filters.course_id ? Number(filters.course_id) : undefined;
    const search = filters.search || '';
    const items_per_page =
      getAll === 'All' ? undefined : Number(filters.items_per_page) || 10;
    const page = filters.page || 1;

    // Common conditions for both count and findMany
    const whereCondition: any = {
      OR: [{ title: { contains: search } }, { content: { contains: search } }],
      AND: [{ status: 1 }],
    };

    // If course_id is provided, add it to the AND conditions
    if (course_id) {
      whereCondition.AND.push({ course_id });
    }

    const total = await this.prismaService.lesson.count({
      where: whereCondition,
    });

    const skip = items_per_page
      ? page > 1
        ? (page - 1) * items_per_page
        : 0
      : 0;

    const lessons = await this.prismaService.lesson.findMany({
      take: items_per_page,
      skip,
      where: whereCondition,
      include: {
        ownership_course: {
          select: {
            id: true,
            name: true,
          },
        },
        Quiz: {
          select: { question: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const lastPage = items_per_page ? Math.ceil(total / items_per_page) : 1;
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;

    return {
      data: lessons,
      total,
      nextPage,
      lastPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page || total,
    };
  }

  async getAllLesson(filters: LessonFilterType): Promise<any> {
    const course_id = Number(filters.course_id);
    const whereCondition = {
      AND: [{ status: 1 }, { course_id: course_id }],
    };
    const total = await this.prismaService.lesson.count({
      where: whereCondition,
    });
    const lessons = await this.prismaService.lesson.findMany({
      where: whereCondition,
      select: { title: true, createdAt: true, id: true },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return {
      data: lessons,
      total,
    };
  }

  async getDetail(id: number): Promise<Lesson> {
    return this.prismaService.lesson.findUnique({ where: { id, status: 1 } });
  }
  async create(data: CreateLessonDto): Promise<Lesson> {
    try {
      return await this.prismaService.lesson.create({
        data: {
          ...data,
          course_id: Number(data.course_id),
        },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('can not create lesson', HttpStatus.BAD_REQUEST);
    }
  }
  async delete(id: number) {
    return await this.prismaService.lesson.update({
      where: { id },
      data: {
        status: 0,
        deletedAt: new Date(),
      },
    });
  }
  async update(id: number, data: UpdateLessonDto): Promise<Lesson> {
    return this.prismaService.lesson.update({
      where: { id },
      data: { ...data },
    });
  }
}
