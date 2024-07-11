import { QuizAnswer } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
export class CreateQuizAnswerDto {
  @IsNotEmpty()
  quiz_id: number;
  @IsNotEmpty()
  answer: string;
  correct?: boolean;
}
export interface QuizAnswerFilterType {
  items_per_page?: number;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface QuizAnswerPaginationResponseType {
  data: QuizAnswer[];
  total: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
export class UpdateQuizAnswerDto {
  question: string;
  correct: boolean;
}
