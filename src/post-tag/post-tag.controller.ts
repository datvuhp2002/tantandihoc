import { Controller,Post,Get, Body, Query, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { PostTagService } from './post-tag.service';
import { PostTag } from '@prisma/client';
import { CreatePostTagDto, PostTagFilterType, PostTagPaginationResponseType } from './dto/post-tag.dto';

@Controller('post-tags')
export class PostTagController {
    constructor(private postTagService: PostTagService){}
    @Post()
    create(@Body() data:CreatePostTagDto):Promise<PostTag>{
        return this.postTagService.create(data)
    }
    @Get()
    getAll(@Query() filters:PostTagFilterType):Promise<PostTagPaginationResponseType>{
        return this.postTagService.getAll(filters)
    }
    @Delete(':id')
    delete(@Param('id',ParseIntPipe) id: number){
        return this.postTagService.delete(id)
    }
}
