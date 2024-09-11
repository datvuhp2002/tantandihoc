import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

import {
  CategoryFilterType,
  CategoryPaginationResponseType,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}
  async create(data: CreateCategoryDto): Promise<Category> {
    try {
      return await this.prismaService.category.create({ data });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'can not create Category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getDetail(id: number): Promise<Category> {
    return await this.prismaService.category.findUnique({ where: { id } });
  }
  async getAll(
    filters: CategoryFilterType,
  ): Promise<CategoryPaginationResponseType> {
    let items_per_page;
    const search = filters.search || '';
    const total = await this.prismaService.category.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            description: {
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
    if (filters.items_per_page === 'All') {
      items_per_page = total;
    } else {
      items_per_page = Number(filters.items_per_page) || 10;
    }
    const page = Number(filters.page) || 1;
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const categories = await this.prismaService.category.findMany({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            description: {
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
        createdAt: 'desc',
      },
    });

    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: categories,
      total,
      nextPage,
      previousPage,
      lastPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async trash(
    filters: CategoryFilterType,
  ): Promise<CategoryPaginationResponseType> {
    let items_per_page;
    const search = filters.search || '';
    const total = await this.prismaService.category.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
        AND: [
          {
            status: 0,
          },
        ],
      },
    });
    if (filters.items_per_page === 'All') {
      items_per_page = total;
    } else {
      items_per_page = Number(filters.items_per_page) || 10;
    }
    const page = Number(filters.page) || 1;
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const categories = await this.prismaService.category.findMany({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
        AND: [
          {
            status: 0,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: categories,
      total,
      nextPage,
      previousPage,
      lastPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async update(id: number, data: UpdateCategoryDto) {
    try {
      return await this.prismaService.category.update({
        where: { id, status: 1 },
        data,
      });
    } catch (err) {
      throw new HttpException(
        'can not update Category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async delete(id: number) {
    return await this.prismaService.category.update({
      where: { id },
      data: { status: 0, deletedAt: new Date() },
    });
  }
  async restore(id: number) {
    await this.prismaService.category.update({
      where: { id },
      data: { status: 1, deletedAt: null },
    });
    await this.prismaService.course.updateMany({
      where: {
        categoryId: id,
      },
      data: {
        status: 1,
        deletedAt: null,
      },
    });
    await this.prismaService.post.updateMany({
      where: {
        categoryId: id,
      },
      data: {
        status: 1,
        deletedAt: null,
      },
    });
  }
  async multipleRestore(ids) {
    await this.prismaService.category.updateMany({
      where: { id: { in: ids } },
      data: { status: 1, deletedAt: null },
    });
    await this.prismaService.course.updateMany({
      where: { categoryId: { in: ids } },
      data: {
        status: 1,
        deletedAt: null,
      },
    });
    await this.prismaService.post.updateMany({
      where: { categoryId: { in: ids } },
      data: {
        status: 1,
        deletedAt: null,
      },
    });
  }

  async softDelete(id: number) {
    const data = await this.prismaService.category.update({
      where: { id },
      data: {
        status: 0,
        deletedAt: new Date(),
      },
    });
    await this.prismaService.course.updateMany({
      where: {
        categoryId: id,
      },
      data: {
        status: 0,
        deletedAt: new Date(),
      },
    });
    await this.prismaService.post.updateMany({
      where: {
        categoryId: id,
      },
      data: {
        status: 0,
        deletedAt: new Date(),
      },
    });
  }
  async multipleSoftDelete(ids) {
    await this.prismaService.category.updateMany({
      where: { id: { in: ids } },
      data: {
        status: 0,
        deletedAt: new Date(),
      },
    });
    await this.prismaService.course.updateMany({
      where: { categoryId: { in: ids } },
      data: {
        status: 0,
        deletedAt: new Date(),
      },
    });
    await this.prismaService.post.updateMany({
      where: { categoryId: { in: ids } },
      data: {
        status: 0,
        deletedAt: new Date(),
      },
    });
  }
  async multipleForceDelete(ids: number[]) {
    // Xóa tất cả các bản ghi liên quan trước
    await this.prismaService.post.deleteMany({
      where: { categoryId: { in: ids } },
    });
    await this.prismaService.course.deleteMany({
      where: { categoryId: { in: ids } },
    });

    // Cuối cùng, xóa danh mục
    await this.prismaService.category.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
