import { Lesson } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateLessonDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  videoFile?: string;
  videoUrl?: string;
  @IsNotEmpty()
  course_id: number;
}
export interface LessonFilterType {
  items_per_page?: number;
  page?: number;
  course_id?: number;
  get_all?: string;
  search?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface LessonPaginationResponseType {
  data: any[];
  total: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
export class UpdateLessonDto {
  title: string;
  content: string;
  thumbnail: string;
  level: number;
}
