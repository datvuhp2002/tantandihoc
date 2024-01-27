import { Controller,Post,Get, Body, Query, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { PostTagService } from './post-tag.service';
import { PostTag } from '@prisma/client';
import { CreatePostTagDto, PostTagFilterType, PostTagPaginationResponseType } from './dto/post-tag.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('post-tags')
export class PostTagController {
    constructor(private postTagService: PostTagService){}
    @Post()
    @Roles('Admin','User')
    create(@Body() data:CreatePostTagDto):Promise<PostTag>{
        return this.postTagService.create(data)
    }
    @Get()
    @Roles('Admin','User')
    getAll(@Query() filters:PostTagFilterType):Promise<PostTagPaginationResponseType>{
        return this.postTagService.getAll(filters)
    }
    @Delete(':id')
    @Roles('Admin','User')
    delete(@Param('id',ParseIntPipe) id: number){
        return this.postTagService.delete(id)
    }
}
