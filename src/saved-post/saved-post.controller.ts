import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { SavedPostService } from './saved-post.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateSavedPostDto, SavedPostFilterType, SavedPostPaginationResponseType } from './dto/saved-post.dto';
import { SavedPost } from '@prisma/client';

@Controller('saved-post')
export class SavedPostController {
    constructor(private savedPostService: SavedPostService){}
    @Post()
    @UseGuards(AuthGuard)
    create(@Req() req: any,@Body() data: CreateSavedPostDto):Promise<SavedPost>{
        return this.savedPostService.create(data = {...data, author_id: req.user_data.id})
    }
    @Get()
    getAll(@Body() data: SavedPostFilterType):Promise<SavedPostPaginationResponseType>{
        return this.savedPostService.getAll(data)
    }
    @Delete(':id')
    delete(@Param('id',ParseIntPipe) id:number){
        return this.savedPostService.delete(id)
    }
}
