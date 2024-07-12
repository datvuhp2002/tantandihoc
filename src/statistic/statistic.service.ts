import { PrismaService } from './../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StatisticService {
  constructor(private prismaService: PrismaService) {}
  async getCourseCountForYear(year: number) {
    const monthlyCourseCounts = [];
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      const CourseCount = await this.prismaService.course.count({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });
      monthlyCourseCounts.push({
        month,
        count: CourseCount,
      });
    }

    return monthlyCourseCounts;
  }
  async getUserCountForYear(year: number) {
    const monthlyUserCounts = [];
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      const userCount = await this.prismaService.user.count({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });
      monthlyUserCounts.push({
        month,
        count: userCount,
      });
    }

    return monthlyUserCounts;
  }
  async getTransactionCountForYear(year: number) {
    const monthlyTransactionCounts = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const transactionCount = await this.prismaService.transaction.count({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      monthlyTransactionCounts.push({
        month,
        count: transactionCount,
      });
    }

    return monthlyTransactionCounts;
  }
  async getTransactionSuccessCountForYear(year: number) {
    const monthlyTransactionCounts = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const transactionCount = await this.prismaService.transaction.count({
        where: {
          status: 1,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      monthlyTransactionCounts.push({
        month,
        count: transactionCount,
      });
    }

    return monthlyTransactionCounts;
  }
  async getTransactionFailCountForYear(year: number) {
    const monthlyTransactionCounts = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const transactionCount = await this.prismaService.transaction.count({
        where: {
          status: 0,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      monthlyTransactionCounts.push({
        month,
        count: transactionCount,
      });
    }

    return monthlyTransactionCounts;
  }
  async getPostCountForYear(year: number) {
    const monthlyPostCounts = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const postCount = await this.prismaService.post.count({
        where: {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      monthlyPostCounts.push({
        month,
        count: postCount,
      });
    }

    return monthlyPostCounts;
  }
  async getPostPublishCountForYear(year: number) {
    const monthlyPostCounts = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const postCount = await this.prismaService.post.count({
        where: {
          isPublished: 1,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      monthlyPostCounts.push({
        month,
        count: postCount,
      });
    }

    return monthlyPostCounts;
  }
  async getPostUnPublishCountForYear(year: number) {
    const monthlyPostCounts = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      const postCount = await this.prismaService.post.count({
        where: {
          isPublished: 0,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

      monthlyPostCounts.push({
        month,
        count: postCount,
      });
    }

    return monthlyPostCounts;
  }
  async getTopRevenueCourses(limit: number): Promise<any[]> {
    const topCourses = await this.prismaService.transaction.groupBy({
      by: ['course_id'],
      where: {
        status: 1,
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: limit,
    });

    const data = await Promise.all(
      topCourses.map(async (item) => {
        const course = await this.prismaService.course.findUnique({
          where: { id: item.course_id },
        });
        return {
          course,
          totalRevenue: item._sum.amount,
        };
      }),
    );

    return data;
  }
}
