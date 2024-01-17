import { BadRequestException, Body, Controller, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors, Get, Query, Delete } from '@nestjs/common';
import { CourseFilterType, CoursePaginationResponseType, createCourseDto } from './dto/course.dto';
import { CourseService } from './course.service';
import { Course } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';

@Controller('courses')
export class CourseController {
    constructor(private courseService: CourseService){}
    @Post()
    @UseInterceptors(FileInterceptor('thumbnail',{
        storage: storageConfig('course'),
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
    create(@Body() data:createCourseDto,  @UploadedFile() file: Express.Multer.File):Promise<Course>{
        if(!file){
            throw new BadRequestException('File is required')
        }
        return this.courseService.create({...data, thumbnail: 'course/'+file.filename});
    }
    @Get(':id')
    getDetail(@Param('id',ParseIntPipe) id: number){
        return this.courseService.getDetail(id);
    }
    @Get()
    getAll(@Query() params:CourseFilterType):Promise<CoursePaginationResponseType>{
        return this.courseService.getAll(params);
    }   
    @Delete(':id')
    delete(@Param('id',ParseIntPipe) id: number){
        this.courseService.delete(id);
    }
}   
