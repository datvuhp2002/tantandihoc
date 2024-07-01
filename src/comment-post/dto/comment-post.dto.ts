import { CommentPost } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
export class CreateCommentPostDto {
  @IsNotEmpty()
  message: string;
  author_id?: number;
  @IsNotEmpty()
  post_id: number;
}
export interface CommentPostFilterType {
  items_per_page?: number;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface CommentPostPaginationResponseType {
  data: CommentPost[];
  total: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
export class UpdateCommentPostDto {
  message: string;
}
