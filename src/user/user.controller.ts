import { Controller, Query, Get, UseGuards, Post,Put, ParseIntPipe, Param, Body, Delete, ParseArrayPipe} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, SoftDeleteUserDto, UpdateUserDto, UserFilterType, UserPaginationResponseType, softMultipleDeleteUserDto } from './dto/user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    @UseGuards(AuthGuard)
    @Post()
    create(@Body() body:CreateUserDto):Promise<User>{
        console.log("create user api", body);
        return this.userService.create(body);
    }
    @UseGuards(AuthGuard)
    @Get()
    getAll(@Query() params:UserFilterType): Promise<UserPaginationResponseType>{
        console.log("get all user api", params);
        return this.userService.getAll(params);
    }
    @UseGuards(AuthGuard)
    @Get(':id')
    getDetail(@Param('id',ParseIntPipe) id: number):Promise<User>{
        console.log('get detail user api =>', id);
        return this.userService.getDetail(id);
    }
    @UseGuards(AuthGuard)
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto ):Promise<User>{
        console.log('update user api =>', id);
        return this.userService.update(id, body);
    }
    @UseGuards(AuthGuard)
    @Delete('/deleteOneById/:id')
    deleteById(@Param('id', ParseIntPipe) id : number): Promise<SoftDeleteUserDto>{
        console.log("delete user => ", id);
        return this.userService.deleteById(id);
    }
    @UseGuards(AuthGuard)
    @Delete('multipleSoftDelete')
    multipleDelete(@Query('ids', new ParseArrayPipe({items: String, separator: ','}))ids: string[]){
        console.log("Multiple Deleted => ",ids)
        return this.userService.multipleDelete(ids);
    }
}
