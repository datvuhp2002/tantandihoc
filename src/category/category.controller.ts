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
import { CategoryService } from './category.service';
import {
  CategoryFilterType,
  CategoryPaginationResponseType,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { Category } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Post()
  @Roles('Admin')
  create(@Body() data: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(data);
  }
  @Get()
  @Roles('Admin')
  getAll(
    @Query() filters: CategoryFilterType,
  ): Promise<CategoryPaginationResponseType> {
    return this.categoryService.getAll(filters);
  }
  @Get(':id')
  @Roles('Admin')
  getDetail(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.getDetail(id);
  }
  @Put(':id')
  @Roles('Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, data);
  }
  @Delete(':id')
  @Roles('Admin')
  delete(@Param('id') id: number) {
    return this.categoryService.delete(id);
  }
}
