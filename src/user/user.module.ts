import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.servcie';

@Module({
  controllers: [UserController],
  providers: [UserService,PrismaService]
})
export class UserModule {}
