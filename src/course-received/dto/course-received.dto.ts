import { CourseReceived } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import SortOrder from '@prisma/client';

export class createCourseReceivedDto {
  @IsNotEmpty()
  name: string;
  course_id: number;
}
export interface CourseReceivedFilterType {
  items_per_page?: number;
  get_all?: string;
  page?: number;
  search?: string;
  sort?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface CourseReceivedPaginationResponseType {
  data: CourseReceived[];
  total: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
