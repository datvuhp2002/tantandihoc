import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SavedPostService } from './saved-post.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CreateSavedPostDto,
  SavedPostFilterType,
  SavedPostPaginationResponseType,
} from './dto/saved-post.dto';
import { SavedPost, User } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { getUser } from 'src/user/decorator/user.decorator';

@Controller('saved-post')
export class SavedPostController {
  constructor(private savedPostService: SavedPostService) {}
  @Post()
  @UseGuards(AuthGuard)
  @Roles('Admin', 'User')
  create(@Req() req: any, @Body() data: CreateSavedPostDto): Promise<any> {
    return this.savedPostService.savePostOrDeleteSavedPost(
      (data = { ...data, author_id: req.user_data.id }),
    );
  }
  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles('Admin', 'User')
  findSavedPost(
    @getUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Boolean> {
    return this.savedPostService.isSavedPost({
      author_id: user.id,
      post_id: id,
    });
  }
  @Get()
  @Roles('Admin', 'User')
  getAll(
    @getUser() user: User,
    @Body() data: SavedPostFilterType,
  ): Promise<SavedPostPaginationResponseType> {
    return this.savedPostService.getAll(user.id, data);
  }
  @Get(`:user`)
  @Roles('Admin', 'User')
  getAllSavedPostFromUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: SavedPostFilterType,
  ): Promise<SavedPostPaginationResponseType> {
    return this.savedPostService.getAll(id, data);
  }
  @Delete(':id')
  @Roles('Admin', 'User')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.savedPostService.delete(id);
  }
}
