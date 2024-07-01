import { Injectable } from '@nestjs/common';
import { CourseReceived } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

import {
  CourseReceivedFilterType,
  CourseReceivedPaginationResponseType,
  createCourseReceivedDto,
} from './dto/course-received.dto';

@Injectable()
export class CourseReceivedService {
  constructor(private prismaService: PrismaService) {}
  async create(data: createCourseReceivedDto): Promise<CourseReceived> {
    return await this.prismaService.courseReceived.create({
      data: { course_id: Number(data.course_id), ...data },
    });
  }
  async getAll(
    id: number,
    filters: CourseReceivedFilterType,
  ): Promise<CourseReceivedPaginationResponseType> {
    const getAll = filters.get_all;
    let items_per_page;
    const search = filters.search || '';
    const sort: 'asc' | 'desc' =
      filters.sort === 'asc' || filters.sort === 'desc' ? filters.sort : 'desc';
    const total = await this.prismaService.courseReceived.count({
      where: {
        OR: [
          {
            name: {
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
    if (getAll === 'true') {
      items_per_page = total;
    } else {
      items_per_page = Number(filters.items_per_page) || 10;
    }
    const page = Number(filters.page) || 1;
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const courseReceived = await this.prismaService.courseReceived.findMany({
      take: items_per_page,
      skip,
      where: {
        course_id: id,
        OR: [
          {
            name: {
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
      orderBy: {
        createdAt: sort,
      },
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: courseReceived,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
}
