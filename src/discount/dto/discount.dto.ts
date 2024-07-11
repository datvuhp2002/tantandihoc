import { Discount } from '@prisma/client';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class createDiscountDto {
  @IsNotEmpty()
  name: string;
  type?: string;
  @IsNotEmpty()
  value: number;
  @IsNotEmpty()
  start_date: Date;
  @IsNotEmpty()
  end_date: Date;
  status?: number;
}
export class updateDiscountDto {
  name?: string;
  type?: string;
  value?: number;
  start_date?: Date;
  end_date?: Date;
  status?: number;
}
export interface DiscountFilterType {
  items_per_page?: string;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface DiscountPaginationResponseType {
  data: Discount[];
  total: number;
  currentPage: number;
  nextPage?: number;
  lastPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
