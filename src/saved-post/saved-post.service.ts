import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateSavedPostDto,
  SavedPostFilterType,
  SavedPostPaginationResponseType,
} from './dto/saved-post.dto';
import { SavedPost } from '@prisma/client';

@Injectable()
export class SavedPostService {
  constructor(private prismaService: PrismaService) {}
  async savePostOrDeleteSavedPost(data: CreateSavedPostDto): Promise<any> {
    const findPost = await this.prismaService.savedPost.findFirst({
      where: { author_id: data.author_id, post_id: Number(data.post_id) },
    });
    if (findPost) {
      await this.prismaService.savedPost.delete({ where: { id: findPost.id } });
      throw new HttpException('Bạn đã bỏ lưu viết này!!!', HttpStatus.ACCEPTED);
    }
    await this.prismaService.savedPost.create({
      data: { ...data, post_id: Number(data.post_id) },
    });
    throw new HttpException('Bạn đã lưu viết này thành công', HttpStatus.OK);
  }
  async isSavedPost({ author_id, post_id }): Promise<boolean> {
    const findPost = await this.prismaService.savedPost.findFirst({
      where: { author_id, post_id },
    });
    if (findPost) {
      return true;
    }
    return false;
  }
  async getAll(
    author_id: number,
    filters: SavedPostFilterType,
  ): Promise<SavedPostPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const savedPosts = await this.prismaService.savedPost.findMany({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            ownership_post: {
              title: {
                contains: search,
              },
              summary: {
                contains: search,
              },
              content: {
                contains: search,
              },
            },
          },
        ],

        AND: [{ status: 1, author_id }],
      },
      select: {
        id: true,
        post_id: true,
        createdAt: true,
        author: true,
        ownership_post: {
          select: {
            title: true,
            summary: true,
            content: true,
            thumbnail: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaService.savedPost.count({
      where: {
        OR: [
          {
            ownership_post: {
              title: {
                contains: search,
              },
              summary: {
                contains: search,
              },
              content: {
                contains: search,
              },
            },
          },
        ],
        AND: [
          {
            status: 1,
            author_id,
          },
        ],
      },
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: savedPosts,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async delete(id: number) {
    return this.prismaService.savedPost.update({
      where: { id },
      data: { status: 0, deletedAt: new Date() },
    });
  }
}
