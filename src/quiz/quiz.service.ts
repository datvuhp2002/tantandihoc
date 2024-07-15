import { Injectable } from '@nestjs/common';
import { Prisma, Quiz } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateQuizDto,
  QuizFilterType,
  QuizPaginationResponseType,
  UpdateQuizDto,
} from './dto/quiz.dto';

@Injectable()
export class QuizService {
  constructor(private prismaService: PrismaService) {}
  async getAllQuizInLesson(lesson_id: number): Promise<any[]> {
    const quiz = await this.prismaService.quiz.findMany({
      where: { lesson_id, status: 1 },
    });
    return quiz;
  }
  async getDetail(id: number): Promise<Quiz> {
    return await this.prismaService.quiz.findUnique({
      where: { id, status: 1 },
      include: {
        QuizAnswer: true,
      },
    });
  }
  async getAll(filters: QuizFilterType): Promise<QuizPaginationResponseType> {
    const lesson_id = Number(filters.lesson_id);
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const where: Prisma.QuizWhereInput = {
      OR: [
        {
          question: {
            contains: search,
          },
        },
      ],
      AND: [
        {
          status: 1,
        },
      ],
    };
    if (!Array.isArray(where.AND)) {
      where.AND = [where.AND];
    }
    if (lesson_id)
      where.AND.push({
        lesson_id: lesson_id,
      });
    const quizs = await this.prismaService.quiz.findMany({
      take: items_per_page,
      skip,
      where,
      include: {
        ownership_Lesson: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaService.quiz.count({
      where: {
        OR: [
          {
            question: {
              contains: search,
            },
          },
        ],
        AND: [
          {
            status: 1,
          },
        ],
      },
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: quizs,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async trash(filters: QuizFilterType): Promise<QuizPaginationResponseType> {
    const lesson_id = Number(filters.lesson_id);
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const where: Prisma.QuizWhereInput = {
      OR: [
        {
          question: {
            contains: search,
          },
        },
      ],
      AND: [
        {
          status: 0,
        },
      ],
    };
    if (!Array.isArray(where.AND)) {
      where.AND = [where.AND];
    }
    if (lesson_id)
      where.AND.push({
        lesson_id: lesson_id,
      });
    const quizs = await this.prismaService.quiz.findMany({
      take: items_per_page,
      skip,
      where,
      include: {
        ownership_Lesson: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaService.quiz.count({
      where: {
        OR: [
          {
            question: {
              contains: search,
            },
          },
        ],
        AND: [
          {
            status: 1,
          },
        ],
      },
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: quizs,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async create(data: CreateQuizDto): Promise<Quiz> {
    return await this.prismaService.quiz.create({
      data: { ...data, lesson_id: Number(data.lesson_id) },
    });
  }
  async delete(id: number) {
    await this.prismaService.quiz.update({
      where: { id },
      data: { status: 0, deletedAt: new Date() },
    });
    await this.prismaService.quizAnswer.updateMany({
      where: { quiz_id: id },
      data: { status: 0, deletedAt: new Date() },
    });
  }
  async restore(id: number) {
    await this.prismaService.quiz.update({
      where: { id },
      data: { status: 1, deletedAt: null },
    });
    await this.prismaService.quizAnswer.updateMany({
      where: { quiz_id: id },
      data: { status: 1, deletedAt: null },
    });
  }
  async multipleForceDelete(ids: number[]) {
    await this.prismaService.quiz.deleteMany({
      where: { id: { in: ids } },
    });
  }
  async multipleSoftDelete(ids: number[]) {
    await this.prismaService.quiz.updateMany({
      where: { id: { in: ids } },
      data: { status: 0, deletedAt: new Date() },
    });
    await this.prismaService.quizAnswer.updateMany({
      where: { quiz_id: { in: ids } },
      data: { status: 0, deletedAt: new Date() },
    });
  }
  async multipleRestore(ids: number[]) {
    await this.prismaService.quiz.updateMany({
      where: { id: { in: ids } },
      data: { status: 1, deletedAt: null },
    });
    await this.prismaService.quizAnswer.updateMany({
      where: { quiz_id: { in: ids } },
      data: { status: 1, deletedAt: null },
    });
  }
  async forceDelete(id: number) {
    await this.prismaService.quiz.delete({
      where: { id },
    });
  }
  async update(id: number, data: UpdateQuizDto) {
    return await this.prismaService.quiz.update({ where: { id }, data });
  }
}
