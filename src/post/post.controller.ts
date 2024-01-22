import { BadRequestException, Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto, PostFilterType, PostPaginationResponseType, UpdatePostDto } from './dto/posts.dto';
import { Post as PostModel } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
@ApiTags('Posts')
@Controller('posts')
export class PostController {
    constructor(private postService: PostService){}
    // Create Post
    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('thumbnail',{
        storage: storageConfig('post'),
        fileFilter:(req,file,cb)=>{
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg', '.png', '.jpeg','.JPG']
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
    }}))
    create(@Req() req: any,@Body() data:CreatePostDto,  @UploadedFile() file: Express.Multer.File):Promise<PostModel>{
        if(req.fileValidationError ){
            throw new BadRequestException(req.fileValidationError);
        }
        if(!file){
            throw new BadRequestException('File is required')
        }
        console.log(req.user_data)
        return this.postService.create(req.user_data.id, {...data, thumbnail: 'post/'+file.filename});
    }
    //Get All
    @Get()
    @UseGuards(AuthGuard)
    getAll(@Query() params:PostFilterType): Promise<PostPaginationResponseType>{
        return this.postService.getAll(params);
    }
    // Get Detail
    @Get(":id")
    @UseGuards(AuthGuard)
    getDetail(@Param('id') id: string):Promise<PostModel>{
        return this.postService.getDetail(Number(id));
    }
    // Update Post
    @Put(":id")
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('thumbnail',{
        storage: storageConfig('post'),
        fileFilter:(req,file,cb)=>{
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg', '.png', '.jpeg','.JPG']
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
    }}))
    update(@Param('id') id: string,@Req() req: any,@Body() data:UpdatePostDto,  @UploadedFile() file: Express.Multer.File):Promise<PostModel>{
        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError);
        }
        if(file ){
            data.thumbnail = 'post/' + file.filename;
        }
        return this.postService.update(Number(id), data);
    }
    //Delete a Post
    @Delete(":id")
    @UseGuards(AuthGuard)
    delete(@Param('id', ParseIntPipe) id : number){
        return this.postService.delete(id)
    }

}
