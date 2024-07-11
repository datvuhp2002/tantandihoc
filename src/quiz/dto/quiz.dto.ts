import { Quiz } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
export class CreateQuizDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  question: string;

  @IsNotEmpty()
  lesson_id: number;
}

export interface QuizFilterType {
  items_per_page?: number;
  lesson_id?: string;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface QuizPaginationResponseType {
  data: Quiz[];
  total: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
export class UpdateQuizDto {
  question: string;
}
