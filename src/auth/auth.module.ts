import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.servcie';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [JwtModule.register({
    global: true,
    secret: '123456',
    signOptions: {expiresIn: '1h'}, 
  }),ConfigModule],
  controllers: [ AuthController],
  providers: [AuthService,PrismaService,JwtService, ConfigService]
})
export class AuthModule {}
