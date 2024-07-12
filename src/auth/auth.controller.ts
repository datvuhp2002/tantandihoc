import {
  Body,
  Controller,
  Post,
  Put,
  SetMetadata,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto/registerUserDto.dto';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @SetMetadata('isPublic', true)
  register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }
  @Post('login')
  @SetMetadata('isPublic', true)
  @UsePipes(ValidationPipe)
  login(@Body() body: LoginUserDto): Promise<User> {
    return this.authService.login(body);
  }
  @Post('refresh_token')
  @SetMetadata('isPublic', true)
  refreshToken(@Body() { refresh_token }): Promise<any> {
    return this.authService.refreshToken(refresh_token);
  }

  @Post('send-token')
  @SetMetadata('isPublic', true)
  async sendEmailToken(@Body('email') email: string) {
    return this.authService.sendEmailToken(email);
  }

  @Post('verify-token')
  @SetMetadata('isPublic', true)
  async verifyToken(@Body() data) {
    return this.authService.verifyToken(data.token);
  }
  @Put('change-password')
  @SetMetadata('isPublic', true)
  async changePassword(@Body() data) {
    return this.authService.changePassword(data);
  }
}
