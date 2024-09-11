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
  @Delete('multiple-force-delete')
  @Roles('Admin')
  multipleForceDelete(@Body() ids) {
    return this.categoryService.multipleForceDelete(ids);
  }
  @Delete('multiple-soft-delete')
  @Roles('Admin')
  multipleSoftDelete(@Body() ids) {
    return this.categoryService.multipleSoftDelete(ids);
  }

  @Delete('soft-delete/:id')
  @Roles('Admin')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.softDelete(id);
  }
  @Put('multiple-restore')
  @Roles('Admin')
  multipleRestore(@Body() ids) {
    return this.categoryService.multipleRestore(ids);
  }
  @Put('restore/:id')
  @Roles('Admin')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.restore(id);
  }

  @Post()
  @Roles('Admin')
  create(@Body() data: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(data);
  }
  @Get('trash')
  @Roles('Admin', 'User')
  trash(
    @Query() filters: CategoryFilterType,
  ): Promise<CategoryPaginationResponseType> {
    return this.categoryService.trash(filters);
  }
  @Get()
  @Roles('Admin', 'User')
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
}
