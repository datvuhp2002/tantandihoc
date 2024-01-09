import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.servcie';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ AuthController],
  providers: [AuthService,PrismaService,JwtService]
})
export class AuthModule {}
