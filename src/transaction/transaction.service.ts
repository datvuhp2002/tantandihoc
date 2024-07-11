import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTransactionDto } from './dto/transaction.dto';
import { Transaction } from '@prisma/client';
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
}
