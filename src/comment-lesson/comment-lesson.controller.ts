import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CommentLessonService } from './comment-lesson.service';
import { CommentLessonFilterType, CommentLessonPaginationResponseType, CreateCommentLessonDto, UpdateCommentLessonDto } from './dto/comment-lesson.dto';
import { CommentLesson } from '@prisma/client';

@Controller('comment-lesson')
export class CommentLessonController {
    constructor(private commentLessonService: CommentLessonService){}
    @Get(':id')
    getDetail(@Param('id',ParseIntPipe) id: number){
        return this.commentLessonService.getDetail(id);
    }
    @Get()
    getAll(@Query() filters: CommentLessonFilterType):Promise<CommentLessonPaginationResponseType>{
        return this.commentLessonService.getAll(filters);
    }
    @Put(':id')
    update(@Param('id',ParseIntPipe) id: number, @Body() data:UpdateCommentLessonDto):Promise<CommentLesson>{
        return this.commentLessonService.update(id,data);
    }
    @Post()
    create(@Body() data: CreateCommentLessonDto):Promise<CommentLesson>{
        return this.commentLessonService.create(data);
    }
    @Delete(':id')
    delete(@Param('id',ParseIntPipe) id: number){
        return this.commentLessonService.delete(id);
    }
    
}
