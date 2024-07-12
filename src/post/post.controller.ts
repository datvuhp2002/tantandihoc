import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreatePostDto,
  PostFilterType,
  PostPaginationResponseType,
  UpdatePostDto,
} from './dto/posts.dto';
import { Post as PostModel, User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { getUser } from 'src/user/decorator/user.decorator';
@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}
  @Put('publishPost')
  @Roles('Admin')
  publishedPost(@Body() ids: []) {
    return this.postService.publishPost(ids);
  }
  @Put('unPublishPost')
  @Roles('Admin')
  unPublishedPost(@Body() ids: []) {
    return this.postService.unPublishPost(ids);
  }
  // Create Post
  @Post()
  @Roles('Admin', 'User')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.JPG'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `Wrong file size. Accepted file size is than 5MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  create(
    @Req() req: any,
    @Body() data: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PostModel> {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    console.log(req.user_data);
    return this.postService.create(req.user_data.id, {
      ...data,
      thumbnail: 'post/' + file.filename,
    });
  }
  @Get('get-all-user-post/:username')
  @Roles('Admin', 'User')
  getAllUserPost(
    @Param('username') username: string,
    @Query() params: PostFilterType,
  ): Promise<PostPaginationResponseType> {
    return this.postService.getAllUserPost(username, params);
  }

  @Get('get-all-my-post')
  @Roles('Admin', 'User')
  getAllMyPost(
    @getUser() user: User,
    @Query() params: PostFilterType,
  ): Promise<PostPaginationResponseType> {
    const ownerId = Number(user.id);
    return this.postService.getAllMyPost(ownerId, params);
  }

  //Get All
  @Get()
  @Roles('Admin', 'User')
  getAll(@Query() params: PostFilterType): Promise<PostPaginationResponseType> {
    return this.postService.getAll(params);
  }
  // Get Detail
  @Get(':id')
  @Roles('Admin', 'User')
  getDetail(@Param('id') id: string): Promise<PostModel> {
    return this.postService.getDetail(Number(id));
  }
  // Update Post
  @Put(':id')
  @Roles('Admin', 'User')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: storageConfig('post'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.JPG'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `Wrong file size. Accepted file size is than 5MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() data: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PostModel> {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (file) {
      data.thumbnail = 'post/' + file.filename;
    }
    return this.postService.update(Number(id), data);
  }
  //Delete a Post
  @Delete(':id')
  @Roles('Admin', 'User')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.postService.deleteOne(id);
  }
  @Post('cke-upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('upload', {
      storage: storageConfig('ckeditor'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.JPG'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `Wrong file size. Accepted file size is than 5MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  ckeUpload(
    @Param('id') id: string,
    @Req() req: any,
    @Body() data: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (file) {
      data.thumbnail = 'post/' + file.filename;
    }
    return {
      url: `ckeditor/${file.filename}`,
    };
  }
}
