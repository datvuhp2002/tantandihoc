import { Post } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
export class CreatePostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  summary: string;
  @IsNotEmpty()
  content: string;
  thumbnail: string;
  @IsNotEmpty()
  categoryId: number;
}
export interface PostFilterType {
  items_per_page?: number;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
  category_id?: number;
  except?: number;
}
export interface PostPaginationResponseType {
  data: Post[];
  total: number;
  currentPage: number;
  nextPage?: number;
  lastPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
export class UpdatePostDto {
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  categoryId: number;
}
