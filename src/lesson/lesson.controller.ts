import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { Lesson } from '@prisma/client';
import { CreateLessonDto, LessonFilterType, LessonPaginationResponseType } from './dto/lesson.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';

@Controller('lessons')
export class LessonController {
    constructor(private lessonService: LessonService){}
    @Get()
    getAll(@Query() params:LessonFilterType):Promise<LessonPaginationResponseType>{
        console.log('getAll lesson');
        return this.lessonService.getAll(params);
    }
    @Get(':id')
    getDetail(@Param('id') id:String){
        return this.lessonService.getDetail(Number(id));
    }
    @Post()
    @UseInterceptors(FileInterceptor('thumbnail',{
        storage: storageConfig('lesson'),
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
    create(@Body() data:CreateLessonDto,  @UploadedFile() file: Express.Multer.File):Promise<Lesson>{
        if(!file){
            throw new BadRequestException('File is required')
        }
        return this.lessonService.create({...data, thumbnail: 'post/'+file.filename});
    }
    @Delete(":id")
    delete(@Param('id', ParseIntPipe) id : number){
        return this.lessonService.delete(id)
    }
    ckeUpload(@Body() data:any, @UploadedFile() file: Express.Multer.File ){
        console.log(data)
        return {
            'url': `ckeditor/${file.filename}`
        }
    }

}
