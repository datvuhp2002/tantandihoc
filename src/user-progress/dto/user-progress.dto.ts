import { UserProgress } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateUserProgressDto {
  author_id: number;
  @IsNotEmpty()
  course_id: number;
  @IsNotEmpty()
  lesson_id: number;
}
export interface UserProgressFilterType {
  items_per_page?: number;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface UserProgressPaginationResponseType {
  data: UserProgress[];
  total: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
export class UpdateUserProgressDto {
  quiz_id?: number;
  score?: number;
}
