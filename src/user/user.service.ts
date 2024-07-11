import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateUserDto,
  SoftDeleteUserDto,
  UpdateUserDto,
  UpdateUserPassword,
  UploadAvatarResult,
  UserFilterType,
  UserPaginationResponseType,
  softMultipleDeleteUserDto,
} from './dto/user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async create(body: CreateUserDto): Promise<User> {
    // step 1: checking email has already exist
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
        status: 1,
      },
    });
    if (user) {
      throw new HttpException(
        { message: 'This email has been used' },
        HttpStatus.BAD_REQUEST,
      );
    }
    // step 2: hash password and store to db
    const hashPassword = await bcrypt.hash(body.password, 10);
    console.log(body);
    const result = await this.prismaService.user.create({
      data: { ...body, password: hashPassword },
    });
    return result;
  }
  async getAll(filters: UserFilterType): Promise<UserPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const users = await this.prismaService.user.findMany({
      take: items_per_page,
      skip,
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
      where: {
        OR: [
          {
            username: {
              contains: search,
            },
          },
          {
            email: {
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
    const total = await this.prismaService.user.count({
      where: {
        OR: [
          {
            username: {
              contains: search,
            },
          },
          {
            email: {
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
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: users,
      total,
      lastPage,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getDetail(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
        status: 1,
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        roles: true,
        avatar: true,
        createdAt: true,
      },
    });
  }
  async getProfile(username: string) {
    return await this.prismaService.user.findUnique({
      where: {
        username,
        status: 1,
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });
  }
  async updatePassword(id: number, data: UpdateUserPassword): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    const verify = await bcrypt.compareSync(data.oldPassword, user.password);
    if (!verify)
      throw new HttpException(
        'Mật khẩu cũ không đúng!',
        HttpStatus.BAD_REQUEST,
      );
    else {
      const hashPassword = await bcrypt.hash(data.newPassword, 10);
      return await this.prismaService.user.update({
        where: { id },
        data: { password: hashPassword },
      });
    }
  }
  async update(id: number, data: UpdateUserDto): Promise<any> {
    if (data.username) {
      const user = await this.prismaService.user.findUnique({
        where: { username: data.username },
      });
      if (user && user.id !== id) {
        throw new HttpException(
          'Tên người dùng đã tồn tại, vui lòng chọn một tên người dùng khác!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    await this.prismaService.user.update({
      where: { id },
      data,
    });
  }
  async deleteById(id: number): Promise<SoftDeleteUserDto> {
    console.log('delete id: ', id);
    return await this.prismaService.user.update({
      where: { id },
      data: {
        status: 0,
        deletedAt: new Date(),
      },
    });
  }
  async multipleDelete(ids: String[]) {
    const updatePromises = ids.map(async (id) => {
      try {
        const updatedUser = await this.prismaService.user.update({
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
        if (!updatedUser) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        return updatedUser;
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
  async uploadAvatar(id: number, avatar: string): Promise<UploadAvatarResult> {
    return await this.prismaService.user.update({
      where: { id },
      data: { avatar },
    });
  }
}
