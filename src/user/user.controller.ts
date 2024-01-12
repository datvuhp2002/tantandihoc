import { Controller, Query, Get, UseGuards, Post,Put, ParseIntPipe, Param, Body, Delete, ParseArrayPipe, Req, UploadedFile, UseInterceptors, BadRequestException} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, SoftDeleteUserDto, UpdateUserDto, UploadAvatarResult, UserFilterType, UserPaginationResponseType} from './dto/user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
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
    @Delete(':id')
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
    @UseInterceptors(FileInterceptor('avatar',{
        storage:storageConfig('avatar'),
        // validate file before upload
        fileFilter:(req,file,cb)=>{
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg', '.png', '.jpeg']
            if(!allowedExtArr.includes(ext)){
                req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                cb(null, false);
            }else{
                const fileSize = parseInt(req.headers['content-length']);
                if(fileSize > 1024 * 1024 * 5){
                    req.fileValidationError = `Wrong file size. Accepted file size is than 5MB`;
                    cb(null, false); 
                }else{
                    cb(null, true);
                }
            }
        }
    }))
    uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File): Promise<UploadAvatarResult>{
        if(req.fileValidationError ){
            throw new BadRequestException(req.fileValidationError);
        }
        if(!file){
            throw new BadRequestException('File is required')
        }
        return this.userService.uploadAvatar(req.user_data.id,file.fieldname + '/' + file.filename )
    }
}
