import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaService } from 'src/prisma.service';
import { UserProgressService } from 'src/user-progress/user-progress.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, UserProgressService],
})
export class TransactionModule {}
