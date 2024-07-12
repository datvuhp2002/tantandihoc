import { User } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsOptional,
  minLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên!' })
  password: string;
  fullname: string;
  role?: string;
  status: number;
}
export interface UserFilterType {
  items_per_page?: string;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface UserPaginationResponseType {
  data: { username: string; email: string; avatar: string; createdAt: Date }[];
  total: number;
  currentPage: number;
  lastPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
export class UpdateUserPassword {
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên!' })
  oldPassword: string;
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên!' })
  newPassword: String;
}
export class UpdateUserDto {
  username?: string;
  fullname?: string;
  avatar?: string;
  status: number;
}
export class SoftDeleteUserDto {
  status: number;
  deletedAt: Date;
}
export class softMultipleDeleteUserDto {
  data: { status: number; deletedAt: Date }[];
}
export class UploadAvatarResult {
  @IsNotEmpty()
  avatar: string;
}
