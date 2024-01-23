import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CommentPostService } from './comment-post.service';
import { CommentPost } from '@prisma/client';
import { CommentPostFilterType, CommentPostPaginationResponseType, CreateCommentPostDto, UpdateCommentPostDto } from './dto/comment-post.dto';

@Controller('comment-posts')
export class CommentPostController {
    constructor(private commentPostService: CommentPostService){}
    @Post()
    create(@Body() data:CreateCommentPostDto):Promise<CommentPost>{
        return this.commentPostService.create(data);
    }
    @Get(':id')
    getDetail(@Param('id',ParseIntPipe) id:number):Promise<CommentPost>{
        return this.commentPostService.getDetail(id)
    }
    @Get()
    getAll(@Query() filters: CommentPostFilterType):Promise<CommentPostPaginationResponseType>{
        return this.commentPostService.getAll(filters)
    }
    @Put(':id')
    update(@Param('id',ParseIntPipe) id: number, @Body() data:UpdateCommentPostDto) {
        return this.commentPostService.update(id, data)
    }
    @Delete(':id')
    delete(@Param('id',ParseIntPipe) id: number){
        return this.commentPostService.delete(id)
    }
}
