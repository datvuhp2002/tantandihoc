import {
  Controller,
  Query,
  Get,
  UseGuards,
  Post,
  Put,
  ParseIntPipe,
  Param,
  Body,
  Delete,
  ParseArrayPipe,
  Req,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import {
  CreateUserDto,
  SoftDeleteUserDto,
  UpdateUserDto,
  UpdateUserPassword,
  UploadAvatarResult,
  UserFilterType,
  UserPaginationResponseType,
} from './dto/user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { getUser } from './decorator/user.decorator';
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Put('multiple-restore')
  @Roles('Admin')
  multipleRestore(@Body() ids: number[]) {
    return this.userService.multipleRestore(ids);
  }
  @Delete('multiple-force-delete')
  @Roles('Admin')
  multipleForceDelete(@Body() ids: number[]) {
    return this.userService.multipleForceDelete(ids);
  }
  @Put('/restore/:id')
  @Roles('Admin')
  restoreUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.restoreUser(id);
  }
  @Delete('soft-delete-multiple')
  @Roles('Admin')
  softDeleteMultiple(@Body() ids: number[]) {
    return this.userService.softDeleteMultiple(ids);
  }
  @Delete('force-delete/:id')
  @Roles('Admin')
  forceDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SoftDeleteUserDto> {
    return this.userService.forceDelete(id);
  }
  @Delete(':id')
  @Roles('Admin')
  deleteById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SoftDeleteUserDto> {
    return this.userService.deleteById(id);
  }
  @Post()
  @Roles('Admin')
  create(@Body() body: CreateUserDto): Promise<User> {
    return this.userService.create(body);
  }
  @Get('/profile')
  @Roles('Admin', 'User')
  getProfile(@getUser() user) {
    return this.userService.getDetail(Number(user.id));
  }
  @Get('/profile/:username')
  @Roles('Admin', 'User')
  getAnotherUserProfile(@Param('username') username: string): Promise<any> {
    return this.userService.getProfile(username);
  }
  @Put('/update-password')
  @Roles('Admin', 'User')
  updatePassword(
    @getUser() user,
    @Body() body: UpdateUserPassword,
  ): Promise<User> {
    const id = Number(user.id);
    return this.userService.updatePassword(id, body);
  }
  @Put('/update')
  @Roles('Admin', 'User')
  updateInformation(@getUser() user, @Body() body: UpdateUserDto) {
    return this.userService.update(Number(user.id), body);
  }
  @Get('trash')
  @Roles('Admin')
  trash(@Query() params: UserFilterType): Promise<UserPaginationResponseType> {
    return this.userService.trash(params);
  }
  @Get()
  @Roles('Admin')
  getAll(@Query() params: UserFilterType): Promise<UserPaginationResponseType> {
    return this.userService.getAll(params);
  }

  @Get(':id')
  @Roles('Admin')
  getDetail(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getDetail(id);
  }

  @Put(':id')
  @Roles('Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, body);
  }

  @Post('upload-avatar')
  @Roles('Admin', 'User')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageConfig('avatar'),
      // validate file before upload
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
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
  @Roles('Admin', 'User')
  uploadAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadAvatarResult> {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.userService.uploadAvatar(
      req.user_data.id,
      file.fieldname + '/' + file.filename,
    );
  }
}
