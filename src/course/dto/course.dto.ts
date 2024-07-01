import { Course } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class createCourseDto {
  @IsNotEmpty()
  name: string;
  thumbnail: string;
  description: string;
}
export interface CourseFilterType {
  items_per_page?: number;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface CoursePaginationResponseType {
  data: Course[];
  total: number;
  currentPage: number;
  nextPage?: number;
  lastPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
