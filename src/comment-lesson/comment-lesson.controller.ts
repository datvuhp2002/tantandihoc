import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CommentLessonService } from './comment-lesson.service';
import { CommentLessonFilterType, CommentLessonPaginationResponseType, CreateCommentLessonDto, UpdateCommentLessonDto } from './dto/comment-lesson.dto';
import { CommentLesson } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('comment-lessons')
export class CommentLessonController {
    constructor(private commentLessonService: CommentLessonService){}
    @Get(':id')
    @Roles('Admin','User')
    getDetail(@Param('id',ParseIntPipe) id: number){
        return this.commentLessonService.getDetail(id);
    }
    @Get()
    @Roles('Admin','User')
    getAll(@Query() filters: CommentLessonFilterType):Promise<CommentLessonPaginationResponseType>{
        return this.commentLessonService.getAll(filters);
    }
    @Put(':id')
    @Roles('Admin','User')
    update(@Param('id',ParseIntPipe) id: number, @Body() data:UpdateCommentLessonDto):Promise<CommentLesson>{
        return this.commentLessonService.update(id,data);
    }
    @Post()
    @Roles('Admin','User')
    create(@Body() data: CreateCommentLessonDto):Promise<CommentLesson>{
        return this.commentLessonService.create(data);
    }
    @Delete(':id')
    @Roles('Admin','User')
    delete(@Param('id',ParseIntPipe) id: number){
        return this.commentLessonService.delete(id);
    }
    
}
