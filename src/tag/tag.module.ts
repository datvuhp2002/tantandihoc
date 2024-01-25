import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { PrismaService } from 'src/prisma.servcie';
import { TagController } from './tag.controller';

@Module({
  controllers: [TagController],
  providers: [TagService,PrismaService]
})
export class TagModule {}
