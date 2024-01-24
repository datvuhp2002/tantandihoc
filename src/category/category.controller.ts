import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryFilterType, CategoryPaginationResponseType, CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from '@prisma/client';

@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService){}
    @Post()
    create(@Body() data:CreateCategoryDto):Promise<Category>{
        return this.categoryService.create(data)
    }
    @Get()
    getAll(@Query() filters:CategoryFilterType):Promise<CategoryPaginationResponseType>{
        return this.categoryService.getAll(filters)
    }
    @Get(":id")
    getDetail(@Param('id',ParseIntPipe) id: number):Promise<Category>{
        return this.categoryService.getDetail(id)
    }
    @Put(':id')
    update(@Param('id',ParseIntPipe) id: number,@Body() data: UpdateCategoryDto){
        return this.categoryService.update(id,data)
    }
    @Delete(':id')
    delete(@Param('id') id: number){
        return this.categoryService.delete(id)
    }
}
