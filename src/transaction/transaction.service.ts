import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateTransactionDto,
  TransactionFilterType,
  TransactionPaginationResponseType,
} from './dto/transaction.dto';
import { Prisma, Transaction } from '@prisma/client';
import { UserProgressService } from 'src/user-progress/user-progress.service';

@Injectable()
export class TransactionService {
  constructor(
    private prismaService: PrismaService,
    private UserProgressService: UserProgressService,
  ) {}
  async create(data: CreateTransactionDto): Promise<Transaction> {
    return await this.prismaService.transaction.create({
      data: {
        ...data,
        course_id: Number(data.course_id),
      },
    });
  }
  async getAll(
    filters: TransactionFilterType,
  ): Promise<TransactionPaginationResponseType> {
    let items_per_page;
    const status = Number(filters.status);
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const where: Prisma.TransactionWhereInput = {
      OR: [
        {
          name: {
            contains: search,
          },
        },
      ],
      AND: [],
    };
    if (!Array.isArray(where.AND)) {
      where.AND = [where.AND];
    }
    if (status && status !== null) {
      where.AND.push({ status });
    }
    const total = await this.prismaService.transaction.count({
      where,
    });
    if (filters.items_per_page !== 'all') {
      items_per_page = Number(filters.items_per_page) || 10;
    } else {
      items_per_page = total;
    }
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const transaction = await this.prismaService.transaction.findMany({
      take: items_per_page,
      skip,
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: transaction,
      total,
      lastPage,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async successPayment(id: number): Promise<Transaction> {
    const transaction = await this.prismaService.transaction.update({
      where: { id },
      data: {
        status: 1,
      },
    });
    const lessons = await this.prismaService.lesson.findFirst({
      where: {
        AND: [{ status: 1 }, { course_id: transaction.course_id }],
      },
      select: { title: true, createdAt: true, id: true },
      orderBy: {
        createdAt: 'asc',
      },
    });
    await this.prismaService.userProgress.create({
      data: {
        course_id: Number(transaction.course_id),
        lesson_id: lessons.id,
        author_id: transaction.user_id,
      },
    });
    return transaction;
  }
  async calculateRevenueForYear(year: number): Promise<number> {
    const startDate = new Date(year, 0, 1); // January 1st of the given year
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999); // December 31st of the given year

    // Query to calculate total revenue within the specified year
    const totalRevenue = await this.prismaService.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 1,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return totalRevenue._sum.amount ?? 0;
  }
}
