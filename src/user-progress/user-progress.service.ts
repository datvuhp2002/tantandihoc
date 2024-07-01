import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserProgress } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateUserProgressDto,
  UpdateUserProgressDto,
  UserProgressFilterType,
  UserProgressPaginationResponseType,
} from './dto/user-progress.dto';
import { last } from 'rxjs';

@Injectable()
export class UserProgressService {
  constructor(private prismaService: PrismaService) {}
  async create(data: CreateUserProgressDto): Promise<UserProgress> {
    const userProgress = await this.prismaService.userProgress.findFirst({
      where: {
        author_id: data.author_id,
        course_id: Number(data.course_id),
        lesson_id: Number(data.lesson_id),
      },
    });
    if (userProgress)
      throw new HttpException(
        'Lesson has already been learned',
        HttpStatus.CONFLICT,
      );
    try {
      return await this.prismaService.userProgress.create({
        data: {
          ...data,
          course_id: Number(data.course_id),
          lesson_id: Number(data.lesson_id),
        },
      });
    } catch (err) {
      throw new HttpException(
        'Không thể đăng ký khóa học này',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getDetail(id: number): Promise<UserProgress> {
    return await this.prismaService.userProgress.findUnique({ where: { id } });
  }
  async detail(author_id: number, id: number): Promise<UserProgress> {
    const userProgress = await this.prismaService.userProgress.findFirst({
      where: { author_id, course_id: id },
      orderBy: {
        createdAt: 'desc',
      },
    });
    if (userProgress) return userProgress;
    throw new HttpException(
      'Không tìm thấy đăng ký khóa học này',
      HttpStatus.NOT_FOUND,
    );
  }
  async checkIsLearned(
    author_id: number,
    id: number,
    lesson_id: number,
  ): Promise<Boolean> {
    const isUserProgress = await this.prismaService.userProgress.findFirst({
      where: { author_id, course_id: id, lesson_id },
    });
    if (isUserProgress) return true;
    return false;
  }
  async getUserProgressByCourseId(
    author_id: number,
    id: number,
  ): Promise<Boolean> {
    const isUserProgress = await this.prismaService.userProgress.findFirst({
      where: { author_id, course_id: id },
    });
    if (isUserProgress) return true;
    return false;
  }
  async getTotalUserRegisterCourse(course_id: number) {
    const userCounts = await this.prismaService.userProgress.groupBy({
      by: ['author_id'],
      where: {
        course_id,
      },
    });
    return userCounts.length;
  }
  async userCourse(author_id: number) {
    try {
      const userProgresses = await this.prismaService.userProgress.findMany({
        where: {
          author_id,
        },
        include: {
          ownership_course: true,
        },
      });

      const courses = userProgresses
        .map((progress) => progress.ownership_course)
        .filter(
          (course, index, self) =>
            index === self.findIndex((c) => c.id === course.id),
        );
      return { data: courses, total: courses.length };
    } catch (error) {
      console.error(error);
      throw new Error('Could not retrieve user courses from progress');
    }
  }
  async getAllLessonUserHasLearned(
    author_id: number,
    course_id: number,
  ): Promise<any> {
    const userProgress = await this.prismaService.userProgress.findMany({
      where: { author_id, course_id },
    });
    const total = await this.prismaService.userProgress.count({
      where: { author_id, course_id },
    });
    return {
      data: userProgress,
      total,
    };
  }
  async getAll(
    filters: UserProgressFilterType,
  ): Promise<UserProgressPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const vocabularies = await this.prismaService.userProgress.findMany({
      take: items_per_page,
      skip,
      where: {
        status: 1,
      },
      include: {
        ownership_course: true,
        ownership_lesson: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaService.userProgress.count({
      where: {
        status: 1,
      },
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: vocabularies,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async update(id: number, data: UpdateUserProgressDto) {
    console.log(data);
    try {
      return await this.prismaService.userProgress.update({
        where: { id, status: 1 },
        data,
      });
    } catch (err) {
      throw new HttpException(
        'can not update UserProgress',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async delete(id: number) {
    return await this.prismaService.userProgress.update({
      where: { id },
      data: { status: 0, deletedAt: new Date() },
    });
  }
}
