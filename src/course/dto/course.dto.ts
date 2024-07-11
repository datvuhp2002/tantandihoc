import { Course } from '@prisma/client';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class createCourseDto {
  @IsNotEmpty()
  name: string;
  thumbnail: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  price: number;
  categoryId: number;
  @IsOptional()
  discount_id?: number;
}
export interface CourseFilterType {
  discount?: number;
  category?: number;
  isFree?: string;
  items_per_page?: string;
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
