import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.servcie';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [UserController],
  providers: [UserService,PrismaService]
})
export class UserModule {}
