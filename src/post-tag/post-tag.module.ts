import { Module } from '@nestjs/common';
import { PostTagController } from './post-tag.controller';
import { PostTagService } from './post-tag.service';
import { PrismaService } from 'src/prisma.servcie';

@Module({
  controllers: [PostTagController],
  providers: [PostTagService,PrismaService]
})
export class PostTagModule {}
