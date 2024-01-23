import { Module } from '@nestjs/common';
import { CommentPostController } from './comment-post.controller';
import { CommentPostService } from './comment-post.service';
import { PrismaService } from 'src/prisma.servcie';

@Module({
  controllers: [CommentPostController],
  providers: [CommentPostService,PrismaService]
})
export class CommentPostModule {}
