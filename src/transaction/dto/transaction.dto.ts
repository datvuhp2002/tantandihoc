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
  status?: number;
  items_per_page?: string;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface TransactionPaginationResponseType {
  data: Transaction[];
  total: number;
  currentPage: number;
  lastPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
export class UpdateTransactionDto {
  question: string;
}
