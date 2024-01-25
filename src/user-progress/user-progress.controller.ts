import { Body, Controller, Get, Post, Req, UseGuards,Delete, ParseIntPipe, Param, Put } from '@nestjs/common';
import { UserProgressService } from './user-progress.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserProgress } from '@prisma/client';
import { CreateUserProgressDto, UpdateUserProgressDto, UserProgressFilterType, UserProgressPaginationResponseType } from './dto/user-progress.dto';

@Controller('user-progress')
export class UserProgressController {
    constructor(private userProgressService: UserProgressService){}
    @Post()
    @UseGuards(AuthGuard)
    create(@Req() req: any,@Body() data: CreateUserProgressDto):Promise<UserProgress>{
        return this.userProgressService.create(data = {...data, author_id: Number(req.user_data.id)})
    }
    @Get()
    getAll(@Body() data: UserProgressFilterType):Promise<UserProgressPaginationResponseType>{
        return this.userProgressService.getAll(data)
    }
    @Put(':id')
    update(@Param('id',ParseIntPipe)id:number,@Body()data: UpdateUserProgressDto):Promise<UserProgress>{
        return this.userProgressService.update(id,data);
    }
    @Delete(':id')
    delete(@Param('id',ParseIntPipe) id:number){
        return this.userProgressService.delete(id)
    }
}
