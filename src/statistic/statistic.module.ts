import { Module } from '@nestjs/common';
import { StatisticsController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticService, PrismaService],
})
export class StatisticModule {}
