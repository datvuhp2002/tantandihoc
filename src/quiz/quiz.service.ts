import { Injectable } from '@nestjs/common';
import { Quiz } from '@prisma/client';
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
  async getDetail(id: number): Promise<Quiz> {
    return await this.prismaService.quiz.findUnique({
      where: { id, status: 1 },
    });
  }
  async getAll(filters: QuizFilterType): Promise<QuizPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const quizs = await this.prismaService.quiz.findMany({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            answer: {
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
      include: {
        onwership_Lesson: {
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
            answer: {
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
  }
  async update(id: number, data: UpdateQuizDto) {
    return await this.prismaService.quiz.update({ where: { id }, data });
  }
}
