import { Module } from '@nestjs/common';
import { UserProgressController } from './user-progress.controller';
import { UserProgressService } from './user-progress.service';
import { PrismaService } from 'src/prisma.servcie';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UserProgressController],
  providers: [UserProgressService, PrismaService, ConfigService]
})
export class UserProgressModule {}
