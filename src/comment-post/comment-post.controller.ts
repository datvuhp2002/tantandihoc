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
import { CommentPostService } from './comment-post.service';
import { CommentPost } from '@prisma/client';
import {
  CommentPostFilterType,
  CommentPostPaginationResponseType,
  CreateCommentPostDto,
  UpdateCommentPostDto,
} from './dto/comment-post.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { getUser } from 'src/user/decorator/user.decorator';

@Controller('comment-posts')
export class CommentPostController {
  constructor(private commentPostService: CommentPostService) {}
  @Get('/get-all-reply-comments/:id')
  @Roles('Admin', 'User')
  getAllReplyComments(
    @Param('id', ParseIntPipe) post_id: number,
    @Query('reply', ParseIntPipe) reply?: number,
  ): Promise<any> {
    return this.commentPostService.getAllReplyComments(reply, post_id);
  }

  @Get('/get-all-comments-in-posts/:id')
  @Roles('Admin', 'User')
  getAllCommentsInPosts(
    @Param('id', ParseIntPipe) post_id: number,
  ): Promise<any> {
    return this.commentPostService.getAllCommentsInPosts(post_id);
  }
  @Post()
  @Roles('Admin', 'User')
  create(
    @getUser() user,
    @Body() data: CreateCommentPostDto,
  ): Promise<CommentPost> {
    const author_id = Number(user.id);
    return this.commentPostService.create({ ...data, author_id });
  }
  @Get(':id')
  @Roles('Admin', 'User')
  getDetail(@Param('id', ParseIntPipe) id: number): Promise<CommentPost> {
    return this.commentPostService.getDetail(id);
  }
  @Get('/get-full-comments-in-post/:id')
  @Roles('Admin')
  getAll(
    @Param('id', ParseIntPipe) post_id: number,
    @Query() filters: CommentPostFilterType,
  ): Promise<CommentPostPaginationResponseType> {
    return this.commentPostService.getAll(post_id, filters);
  }
  @Put(':id')
  @Roles('Admin', 'User')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCommentPostDto,
  ) {
    return this.commentPostService.update(id, data);
  }
  @Delete('multiple-delete')
  @Roles('Admin')
  multipleDelete(@Body() ids) {
    return this.commentPostService.multipleDelete(ids);
  }
  @Delete(':id')
  @Roles('Admin', 'User')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentPostService.delete(id);
  }
}
