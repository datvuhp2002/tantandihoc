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

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}
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
    let items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
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
          ownerId: user.id,
        },
      ],
    };

    if (!Array.isArray(whereClause.AND)) {
      whereClause.AND = [whereClause.AND];
    }

    if (filters.category_id) {
      whereClause.AND.push({
        categoryId: Number(filters.category_id),
      });
    }
    if (filters.except) {
      whereClause.AND.push({
        id: { not: Number(filters.except) },
      });
    }
    if (filters.isPublished) {
      if (filters.isPublished === 'true')
        whereClause.AND.push({
          isPublished: 1,
        });
      if (filters.isPublished === 'false')
        whereClause.AND.push({
          isPublished: 0,
        });
    }

    const total = await this.prismaService.post.count({
      where: whereClause,
    });
    if (filters.items_per_page == 'all') {
      items_per_page = total;
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
    let items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
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
          ownerId,
        },
      ],
    };

    if (!Array.isArray(whereClause.AND)) {
      whereClause.AND = [whereClause.AND];
    }

    if (filters.category_id) {
      whereClause.AND.push({
        categoryId: Number(filters.category_id),
      });
    }
    if (filters.except) {
      whereClause.AND.push({
        id: { not: Number(filters.except) },
      });
    }
    if (filters.isPublished) {
      if (filters.isPublished === 'true')
        whereClause.AND.push({
          isPublished: 1,
        });
      if (filters.isPublished === 'false')
        whereClause.AND.push({
          isPublished: 0,
        });
    }

    const total = await this.prismaService.post.count({
      where: whereClause,
    });
    if (filters.items_per_page == 'all') {
      items_per_page = total;
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
    let items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';

    const skip = page > 1 ? (page - 1) * items_per_page : 0;
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

    if (!Array.isArray(whereClause.AND)) {
      whereClause.AND = [whereClause.AND];
    }

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

    if (category) {
      whereClause.AND.push({
        categoryId: category,
      });
    }

    if (filters.except) {
      whereClause.AND.push({
        id: { not: Number(filters.except) },
      });
    }

    const total = await this.prismaService.post.count({
      where: whereClause,
    });
    if (filters.items_per_page == 'all') {
      items_per_page = total;
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
  async trash(filters: PostFilterType): Promise<PostPaginationResponseType> {
    const isPublished = filters.isPublished;
    const category = Number(filters.category_id);
    let items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';

    const skip = page > 1 ? (page - 1) * items_per_page : 0;
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
          status: 0,
        },
      ],
    };

    if (!Array.isArray(whereClause.AND)) {
      whereClause.AND = [whereClause.AND];
    }

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

    if (category) {
      whereClause.AND.push({
        categoryId: category,
      });
    }

    if (filters.except) {
      whereClause.AND.push({
        id: { not: Number(filters.except) },
      });
    }

    const total = await this.prismaService.post.count({
      where: whereClause,
    });
    if (filters.items_per_page == 'all') {
      items_per_page = total;
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

  async findOne(id: number): Promise<Post> {
    const post = await this.prismaService.post.findUnique({
      where: { id },
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

    if (!post) {
      throw new NotFoundException('post not found');
    }
    return post;
  }

  async update(id: number, data: UpdatePostDto): Promise<Post> {
    if (data.categoryId) {
      data.categoryId = Number(data.categoryId);
    }
    return this.prismaService.post.update({
      where: { id },
      data,
    });
  }

  async deleteOne(id: number): Promise<Post> {
    return await this.prismaService.post.update({
      where: { id },
      data: {
        status: 0,
        deletedAt: new Date(),
      },
    });
  }
  async forceDelete(id: number): Promise<Post> {
    return await this.prismaService.post.delete({
      where: { id },
    });
  }
  async restore(id: number): Promise<Post> {
    return await this.prismaService.post.update({
      where: { id },
      data: {
        status: 1,
        deletedAt: null,
      },
    });
  }
  async multipleRestore(ids: number[]) {
    return await this.prismaService.post.updateMany({
      where: { id: { in: ids } },
      data: {
        status: 1,
        deletedAt: null,
      },
    });
  }
  async multipleSoftDelete(ids) {
    await this.prismaService.post.updateMany({
      where: { id: { in: ids } },
      data: {
        status: 0,
        deletedAt: new Date(),
      },
    });
  }
  async multipleForceDelete(ids) {
    await this.prismaService.post.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async deleteAllMyPosts(ownerId: number) {
    await this.prismaService.post.deleteMany({
      where: { ownerId },
    });
  }
}
