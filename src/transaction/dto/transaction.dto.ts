import { Transaction } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
export class CreateTransactionDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  amount: number;
  user_id: number;
  @IsNotEmpty()
  course_id: number;
}

export interface TransactionFilterType {
  items_per_page?: number;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface TransactionPaginationResponseType {
  data: Transaction[];
  total: number;
  currentPage: number;
  finalPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
export class UpdateTransactionDto {
  question: string;
}
