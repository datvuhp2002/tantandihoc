import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('cke-upload')
  @UseInterceptors(FileInterceptor('upload',{
      storage: storageConfig('ckeditor'),
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
  ckeUpload(@Body() data:any, @UploadedFile() file: Express.Multer.File ){
      console.log(data)
      return {
          'url': `ckeditor/${file.filename}`
      }
  }
}
