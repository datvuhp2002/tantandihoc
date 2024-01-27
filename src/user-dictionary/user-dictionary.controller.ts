import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { UserDictionaryService } from './user-dictionary.service';
import { CreateUserDictionaryDto, UserDictionaryFilterType, UserDictionaryPaginationResponseType } from './dto/user-dictionary.dto';
import { UserDictionary } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('user-dictionary')
export class UserDictionaryController {
    constructor(private userDictionaryService: UserDictionaryService){}
    @Post()
    @Roles('Admin','User')
    create(@Req() req: any,@Body() data: CreateUserDictionaryDto):Promise<UserDictionary>{
        return this.userDictionaryService.create(data = {...data, author_id: req.user_data.id})
    }
    @Get()
    @Roles('Admin','User')
    getAll(@Body() data: UserDictionaryFilterType):Promise<UserDictionaryPaginationResponseType>{
        return this.userDictionaryService.getAll(data)
    }
    @Get()
    @Roles('Admin','User')
    finished(@Body() data: UserDictionaryFilterType):Promise<UserDictionaryPaginationResponseType>{
        return this.userDictionaryService.getAll(data)
    }
    @Delete(':id')
    @Roles('Admin','User')
    delete(@Param('id',ParseIntPipe) id:number){
        return this.userDictionaryService.delete(id)
    }
    
}
