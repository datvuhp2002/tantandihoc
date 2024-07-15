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
import { CommentLessonService } from './comment-lesson.service';
import {
  CommentLessonFilterType,
  CommentLessonPaginationResponseType,
  CreateCommentLessonDto,
  UpdateCommentLessonDto,
} from './dto/comment-lesson.dto';
import { CommentLesson } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { getUser } from 'src/user/decorator/user.decorator';

@Controller('comment-lessons')
export class CommentLessonController {
  constructor(private commentLessonService: CommentLessonService) {}
  @Get(':id')
  @Roles('Admin', 'User')
  getDetail(@Param('id', ParseIntPipe) id: number) {
    return this.commentLessonService.getDetail(id);
  }
  @Get('/get-all-reply-comments/:id')
  @Roles('Admin', 'User')
  getAllReplyComments(
    @Param('id', ParseIntPipe) lesson_id: number,
    @Query('reply', ParseIntPipe) reply?: number,
  ): Promise<any> {
    return this.commentLessonService.getAllReplyComments(reply, lesson_id);
  }
  @Get('/get-all-comments-in-lessons/:id')
  @Roles('Admin', 'User')
  getAllCommentsInLessons(
    @Param('id', ParseIntPipe) lesson_id: number,
  ): Promise<any> {
    return this.commentLessonService.getAllCommentsInLessons(lesson_id);
  }
  @Get('get-all-lessons-comment/:id')
  @Roles('Admin')
  getAll(
    @Param('id', ParseIntPipe) lesson_id: number,
    @Query() filters: CommentLessonFilterType,
  ): Promise<CommentLessonPaginationResponseType> {
    return this.commentLessonService.getAll(lesson_id, filters);
  }
  @Put(':id')
  @Roles('Admin', 'User')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCommentLessonDto,
  ): Promise<CommentLesson> {
    return this.commentLessonService.update(id, data);
  }
  @Post()
  @Roles('Admin', 'User')
  create(
    @getUser() user,
    @Body() data: CreateCommentLessonDto,
  ): Promise<CommentLesson> {
    const author_id = Number(user.id);
    if (data.reply) {
      data.reply = Number(data.reply);
    }
    return this.commentLessonService.create({ ...data, author_id });
  }
  @Delete('/multiple-delete')
  @Roles('Admin')
  multipleDelete(@Body() ids) {
    return this.commentLessonService.multipleDelete(ids);
  }
  @Delete(':id')
  @Roles('Admin', 'User')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentLessonService.delete(id);
  }
}
