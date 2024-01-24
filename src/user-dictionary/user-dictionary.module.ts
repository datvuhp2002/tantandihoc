import { Module } from '@nestjs/common';
import { UserDictionaryController } from './user-dictionary.controller';
import { UserDictionaryService } from './user-dictionary.service';
import { PrismaService } from 'src/prisma.servcie';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UserDictionaryController],
  providers: [UserDictionaryService,PrismaService,ConfigService]
})
export class UserDictionaryModule {}
