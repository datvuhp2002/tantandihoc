import { Injectable } from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

import {
  CourseFilterType,
  CoursePaginationResponseType,
  createCourseDto,
} from './dto/course.dto';

@Injectable()
export class CourseService {
  constructor(private prismaService: PrismaService) {}
  async create(data: createCourseDto): Promise<Course> {
    if (data.discount_id) {
      data.discount_id = Number(data.discount_id);
    }
    if (data.categoryId) {
      data.categoryId = Number(data.categoryId);
    }
    return await this.prismaService.course.create({
      data: {
        ...data,
        price: Number(data.price),
      },
    });
  }
  async update(id: number, data: createCourseDto): Promise<Course> {
    if (data.discount_id) {
      data.discount_id = Number(data.discount_id);
    }
    if (data.categoryId) {
      data.categoryId = Number(data.categoryId);
    }
    return await this.prismaService.course.update({
      where: { id },
      data: {
        ...data,
        price: Number(data.price),
      },
    });
  }
  async getDetail(id: number) {
    return await this.prismaService.course.findUnique({
      where: { id, status: 1 },
      include: { ownership_discount: true },
    });
  }
  async getAll(
    filters: CourseFilterType,
  ): Promise<CoursePaginationResponseType> {
    const search = filters.search || '';
    const category = Number(filters.category);
    const discount = Number(filters.discount);

    // Tạo điều kiện where chung
    const where: Prisma.CourseWhereInput = {
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
    };
    // Đảm bảo whereClause.AND luôn là một mảng
    if (!Array.isArray(where.AND)) {
      where.AND = [where.AND];
    }
    if (filters.isFree === 'true') {
      where.AND.push({ price: 0 });
    }
    if (discount) {
      where.AND.push({ discount_id: discount });
    }
    if (category) {
      where.AND.push({ categoryId: category });
    }
    const total = await this.prismaService.course.count({
      where,
    });

    let items_per_page: number;
    if (filters.items_per_page === 'All') {
      items_per_page = total;
    } else {
      items_per_page = Number(filters.items_per_page) || 10;
    }

    const page = Number(filters.page) || 1;
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const courses = await this.prismaService.course.findMany({
      take: items_per_page,
      skip,
      include: { ownership_discount: true },
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;

    return {
      data: courses,
      total,
      nextPage,
      lastPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async trash(
    filters: CourseFilterType,
  ): Promise<CoursePaginationResponseType> {
    const search = filters.search || '';
    const category = Number(filters.category);
    const discount = Number(filters.discount);

    const where: Prisma.CourseWhereInput = {
      OR: [
        {
          name: {
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
    // Đảm bảo whereClause.AND luôn là một mảng
    if (!Array.isArray(where.AND)) {
      where.AND = [where.AND];
    }
    if (filters.isFree === 'true') {
      where.AND.push({ price: 0 });
    }
    if (discount) {
      where.AND.push({ discount_id: discount });
    }
    if (category) {
      where.AND.push({ categoryId: category });
    }
    const total = await this.prismaService.course.count({
      where,
    });

    let items_per_page: number;
    if (filters.items_per_page === 'All') {
      items_per_page = total;
    } else {
      items_per_page = Number(filters.items_per_page) || 10;
    }

    const page = Number(filters.page) || 1;
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const courses = await this.prismaService.course.findMany({
      take: items_per_page,
      skip,
      include: { ownership_discount: true },
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;

    return {
      data: courses,
      total,
      nextPage,
      lastPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async delete(id: number) {
    return await this.prismaService.course.update({
      where: { id },
      data: {
        status: 0,
        deletedAt: new Date(),
      },
    });
  }
  async forceDelete(id: number) {
    return await this.prismaService.course.delete({
      where: { id },
    });
  }
  async multipleSoftDelete(ids) {
    return await this.prismaService.course.updateMany({
      where: { id: { in: ids } },
      data: {
        status: 0,
        deletedAt: new Date(),
      },
    });
  }
  async multipleForceDelete(ids) {
    return await this.prismaService.course.deleteMany({
      where: { id: { in: ids } },
    });
  }
  async restore(id: number) {
    return await this.prismaService.course.update({
      where: { id },
      data: {
        status: 1,
        deletedAt: null,
      },
    });
  }
  async multipleRestore(ids) {
    return await this.prismaService.course.updateMany({
      where: { id: { in: ids } },
      data: {
        status: 1,
        deletedAt: null,
      },
    });
  }
  async addDiscount(ids, id) {
    return await this.prismaService.course.updateMany({
      where: { id: { in: ids } },
      data: {
        discount_id: id,
      },
    });
  }
}
