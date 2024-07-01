import { Module } from '@nestjs/common';
import { SavedPostController } from './saved-post.controller';
import { SavedPostService } from './saved-post.service';
import { PrismaService } from 'src/prisma.service';

import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [SavedPostController],
  providers: [SavedPostService, PrismaService, ConfigService],
})
export class SavedPostModule {}
