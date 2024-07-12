import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticService) {}

  @Get('users/:year')
  @Roles('Admin')
  async getUserCountForYear(@Param('year') year: number) {
    return this.statisticsService.getUserCountForYear(year);
  }

  @Get('transactions/:year')
  @Roles('Admin')
  async getTransactionCountForYear(@Param('year') year: number) {
    return this.statisticsService.getTransactionCountForYear(year);
  }
  @Get('transactions/success/:year')
  @Roles('Admin')
  async getTransactionSucessCountForYear(@Param('year') year: number) {
    return this.statisticsService.getTransactionSuccessCountForYear(year);
  }
  @Get('transactions/fail/:year')
  @Roles('Admin')
  async getTransactionFailCountForYear(@Param('year') year: number) {
    return this.statisticsService.getTransactionFailCountForYear(year);
  }

  @Get('courses/:year')
  @Roles('Admin')
  async getCourseCountForYear(@Param('year') year: number) {
    return this.statisticsService.getCourseCountForYear(year);
  }
  @Get('posts/:year')
  @Roles('Admin')
  async getPostCountForYear(@Param('year') year: number) {
    return this.statisticsService.getPostCountForYear(year);
  }
  @Get('posts/publish/:year')
  @Roles('Admin')
  async getPostPublishCountForYear(@Param('year') year: number) {
    return this.statisticsService.getPostPublishCountForYear(year);
  }
  @Get('posts/un-publish/:year')
  @Roles('Admin')
  async getPostUnPublishCountForYear(@Param('year') year: number) {
    return this.statisticsService.getPostUnPublishCountForYear(year);
  }
  @Get('top-revenue/:limit')
  async getTopRevenueCourses(
    @Param('limit', ParseIntPipe) limit: number,
  ): Promise<any[]> {
    const topCourses = await this.statisticsService.getTopRevenueCourses(limit);
    return topCourses;
  }
}
