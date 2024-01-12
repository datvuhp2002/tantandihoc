import { Controller, Query, Get, UseGuards, Post,Put, ParseIntPipe, Param, Body, Delete, ParseArrayPipe, Req, UploadedFile, UseInterceptors} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, SoftDeleteUserDto, UpdateUserDto, UserFilterType, UserPaginationResponseType, softMultipleDeleteUserDto } from './dto/user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
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
    @Get()
    @UseGuards(AuthGuard)
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
    @Put(':id')
    @UseGuards(AuthGuard)
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto ):Promise<User>{
        console.log('update user api =>', id);
        return this.userService.update(id, body);
    }
    @Delete('/deleteOneById/:id')
    @UseGuards(AuthGuard)
    deleteById(@Param('id', ParseIntPipe) id : number): Promise<SoftDeleteUserDto>{
        console.log("delete user => ", id);
        return this.userService.deleteById(id);
    }
    @Delete('multipleSoftDelete')
    @UseGuards(AuthGuard)
    multipleDelete(@Query('ids', new ParseArrayPipe({items: String, separator: ','}))ids: string[]){
        console.log("Multiple Deleted => ",ids)
        return this.userService.multipleDelete(ids);
    }
    @Post('upload-avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('avatar',{storage: storageConfig('avatar')}))
    uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File){
        console.log("upload avatar")
        console.log('user date', req.user_data)
        console.log(file)
    }
}
