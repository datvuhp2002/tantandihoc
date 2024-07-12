import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Roles } from 'src/auth/decorator/roles.decorator';

import {
  CreateTransactionDto,
  TransactionFilterType,
  TransactionPaginationResponseType,
} from './dto/transaction.dto';
import { Transaction } from '@prisma/client';
import { getUser } from 'src/user/decorator/user.decorator';
@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  @Get()
  @Roles('Admin')
  getAll(
    @Query() filters: TransactionFilterType,
  ): Promise<TransactionPaginationResponseType> {
    return this.transactionService.getAll(filters);
  }
  @Roles('Admin', 'User')
  @Post()
  create(
    @Body() data: CreateTransactionDto,
    @getUser() user,
  ): Promise<Transaction> {
    const user_id = Number(user.id);
    data.user_id = user_id;
    return this.transactionService.create(data);
  }
  @Roles('Admin', 'User')
  @Put('/success-payment/:id')
  successPayment(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.successPayment(id);
  }
  @Get('calculateRevenueForYear/:year')
  @Roles('Admin')
  async getPostCountForYear(@Param('year') year: number) {
    return this.transactionService.calculateRevenueForYear(year);
  }
}
