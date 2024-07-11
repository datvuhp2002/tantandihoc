import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import {
  CreatePostDto,
  PostFilterType,
  PostPaginationResponseType,
  UpdatePostDto,
} from './dto/posts.dto';
import { Post, Prisma } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { filter } from 'rxjs';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}
  async publishPost(ids) {
    await this.prismaService.post.updateMany({
      where: { id: { in: ids } },
      data: { isPublished: 1 },
    });
  }
  async unPublishPost(ids) {
    await this.prismaService.post.updateMany({
      where: { id: { in: ids } },
      data: { isPublished: 0 },
    });
  }
  async create(id: number, data: CreatePostDto): Promise<Post> {
    try {
      return await this.prismaService.post.create({
        data: { ...data, ownerId: id, categoryId: Number(data.categoryId) },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('can not create post', HttpStatus.BAD_REQUEST);
    }
  }
  async getAllUserPost(
    username: string,
    filters: PostFilterType,
  ): Promise<PostPaginationResponseType> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const whereClause = {
      OR: [
        {
          title: {
            contains: search,
          },
        },
        {
          summary: {
            contains: search,
          },
        },
        {
          content: {
            contains: search,
          },
        },
      ],
      AND: [
        {
          status: 1,
          ownerId: user.id,
        },
      ],
    };

    if (filters.category_id) {
      whereClause.AND.push({
        categoryId: Number(filters.category_id),
      } as any);
    }
    if (filters.except) {
      whereClause.AND.push({
        id: { not: Number(filters.except) },
      } as any);
    }
    const posts = await this.prismaService.post.findMany({
      take: items_per_page,
      skip,
      where: whereClause,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaService.post.count({
      where: whereClause,
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: posts,
      total,
      nextPage,
      lastPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getAllMyPost(
    ownerId: number,
    filters: PostFilterType,
  ): Promise<PostPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const whereClause = {
      OR: [
        {
          title: {
            contains: search,
          },
        },
        {
          summary: {
            contains: search,
          },
        },
        {
          content: {
            contains: search,
          },
        },
      ],
      AND: [
        {
          status: 1,
          ownerId,
        },
      ],
    };

    if (filters.category_id) {
      whereClause.AND.push({
        categoryId: Number(filters.category_id),
      } as any);
    }
    if (filters.except) {
      whereClause.AND.push({
        id: { not: Number(filters.except) },
      } as any);
    }
    const posts = await this.prismaService.post.findMany({
      take: items_per_page,
      skip,
      where: whereClause,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaService.post.count({
      where: whereClause,
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: posts,
      total,
      nextPage,
      lastPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getAll(filters: PostFilterType): Promise<PostPaginationResponseType> {
    const isPublished = filters.isPublished;
    const category = Number(filters.category_id);
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    // Khởi tạo whereClause với điều kiện mặc định
    const whereClause: Prisma.PostWhereInput = {
      OR: [
        {
          title: {
            contains: search,
          },
        },
        {
          summary: {
            contains: search,
          },
        },
        {
          content: {
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
    if (!Array.isArray(whereClause.AND)) {
      whereClause.AND = [whereClause.AND];
    }
    // Thêm điều kiện isPublished nếu có
    if (isPublished) {
      if (isPublished === 'true')
        whereClause.AND.push({
          isPublished: 1,
        });
      if (isPublished === 'false')
        whereClause.AND.push({
          isPublished: 0,
        });
    }
    // Thêm điều kiện category nếu có
    if (category) {
      whereClause.AND.push({
        categoryId: category,
      });
    }

    // Thêm điều kiện except nếu có
    if (filters.except) {
      whereClause.AND.push({
        id: { not: Number(filters.except) },
      });
    }

    const posts = await this.prismaService.post.findMany({
      take: items_per_page,
      skip,
      where: whereClause,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prismaService.post.count({
      where: whereClause,
    });

    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;

    return {
      data: posts,
      total,
      nextPage,
      lastPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetail(id: number): Promise<Post> {
    return this.prismaService.post.findUnique({
      where: { id, status: 1 },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  async update(id: number, data: UpdatePostDto): Promise<Post> {
    try {
      return await this.prismaService.post.update({
        where: { id },
        data: { ...data, categoryId: Number(data.categoryId) },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('can not update post', HttpStatus.BAD_REQUEST);
    }
  }
  async delete(id: number) {
    return await this.prismaService.post.update({
      where: { id },
      data: {
        status: 0,
        deletedAt: new Date(),
      },
    });
  }
  async multipleDelete(ids: Number[]) {
    const updatePromises = ids.map(async (id) => {
      try {
        const updatedPost = await this.prismaService.post.update({
          where: { id: Number(id), status: 1 },
          data: {
            status: 0,
            deletedAt: new Date(),
          },
          select: {
            status: true,
            deletedAt: true,
          },
        });
        if (!updatedPost) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return updatedPost;
      } catch (error) {
        // Handle the error, for example, log it and continue with the next iteration
        console.error(`Error updating user with ID ${id}:`, error.message);
        return null;
      }
    });
    const updatedResults = await Promise.all(updatePromises);
    updatedResults.filter((result) => result !== null);
    return updatedResults;
  }
}
