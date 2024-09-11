import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Discount } from '@prisma/client';
import {
  DiscountFilterType,
  DiscountPaginationResponseType,
  createDiscountDto,
  updateDiscountDto,
} from './dto/discount.dto';
@Controller('discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}
  @Delete()
  @Roles('Admin')
  async bulkDelete(@Body('ids') ids: number[]): Promise<void> {
    await this.discountService.deleteMany(ids);
  }
  @Delete(':id')
  @Roles('Admin')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.discountService.delete(id);
  }
  @Put(':id')
  @Roles('Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: updateDiscountDto,
  ): Promise<Discount> {
    return this.discountService.update(id, data);
  }
  @Post()
  @Roles('Admin')
  create(@Body() data: createDiscountDto): Promise<Discount> {
    return this.discountService.create(data);
  }
  @Get(':id')
  @Roles('Admin')
  detail(@Param('id', ParseIntPipe) id: number): Promise<Discount> {
    return this.discountService.detail(id);
  }
  @Get()
  @Roles('Admin', 'User')
  getAll(
    @Query() filter: DiscountFilterType,
  ): Promise<DiscountPaginationResponseType> {
    return this.discountService.getAll(filter);
  }
}
