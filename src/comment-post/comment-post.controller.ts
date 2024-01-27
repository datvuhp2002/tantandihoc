import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CommentPostService } from './comment-post.service';
import { CommentPost } from '@prisma/client';
import { CommentPostFilterType, CommentPostPaginationResponseType, CreateCommentPostDto, UpdateCommentPostDto } from './dto/comment-post.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('comment-posts')
export class CommentPostController {
    constructor(private commentPostService: CommentPostService){}
    @Post()
    @Roles('Admin','User')
    create(@Body() data:CreateCommentPostDto):Promise<CommentPost>{
        return this.commentPostService.create(data);
    }
    @Get(':id')
    @Roles('Admin','User')
    getDetail(@Param('id',ParseIntPipe) id:number):Promise<CommentPost>{
        return this.commentPostService.getDetail(id)
    }
    @Get()
    @Roles('Admin','User')
    getAll(@Query() filters: CommentPostFilterType):Promise<CommentPostPaginationResponseType>{
        return this.commentPostService.getAll(filters)
    }
    @Put(':id')
    @Roles('Admin','User')
    update(@Param('id',ParseIntPipe) id: number, @Body() data:UpdateCommentPostDto) {
        return this.commentPostService.update(id, data)
    }
    @Delete(':id')
    @Roles('Admin','User')
    delete(@Param('id',ParseIntPipe) id: number){
        return this.commentPostService.delete(id)
    }
}
