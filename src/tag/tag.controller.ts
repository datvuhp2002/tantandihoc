import { Body, Controller,Delete,Get,Param,ParseIntPipe,Post, Put, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from '@prisma/client';
import { CreateTagDto, TagFilterType, TagPaginationResponseType, UpdateTagDto } from './dto/tag.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Tags')
@Controller('tags')
export class TagController {
    constructor(private tagService: TagService){}
    @Post()
    create(@Body() data:CreateTagDto):Promise<Tag>{
        return this.tagService.create(data)
    }
    @Get()
    getAll(@Query() filters:TagFilterType):Promise<TagPaginationResponseType>{
        return this.tagService.getAll(filters)
    }
    @Get(":id")
    getDetail(@Param('id',ParseIntPipe) id: number):Promise<Tag>{
        return this.tagService.getDetail(id)
    }
    @Put(':id')
    update(@Param('id',ParseIntPipe) id: number,@Body() data: UpdateTagDto){
        return this.tagService.update(id,data)
    }
    @Delete(':id')
    delete(@Param('id',ParseIntPipe) id: number){
        return this.tagService.delete(id)
    }
}
